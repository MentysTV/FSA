import { prisma } from "../prisma";
import { parseAndValidateTarget } from "./input-validator";
import { FiveMEndpointClient } from "./endpoint-client";
import { EvidenceEngine } from "./evidence-engine";
import { FrameworkDetector } from "./framework-detector";
import { ResourceDetector } from "./resource-detector";
import { FetchedMetadata, ScanReportSummary, ScanStatus, TargetInput } from "./types";

export interface ScanOptions {
  userId?: string;
  scanMode?: "public" | "authorized";
}

export class ScannerService {
  /**
   * Performs an end-to-end server analysis following the verifiable evidence pipeline.
   */
  static async runScan(targetString: string, options: ScanOptions = {}): Promise<ScanReportSummary> {
    const startTime = Date.now();
    const evidenceEngine = new EvidenceEngine();

    // 1. Validation & SSRF Check
    const validation = await parseAndValidateTarget(targetString);
    if (!validation.valid || !validation.target) {
      throw new Error(validation.error || "Neplatný cíl pro skenování.");
    }
    const target = validation.target;

    // 2. Persist or get ServerTarget in DB
    const serverTarget = await prisma.serverTarget.upsert({
      where: { normalizedIdentifier: target.normalizedIdentifier },
      create: {
        normalizedIdentifier: target.normalizedIdentifier,
        displayName: target.normalizedIdentifier,
        targetType: target.targetType,
        ip: target.ip,
        port: target.port,
        serverCode: target.serverCode,
      },
      update: {
        ip: target.ip,
        port: target.port,
        serverCode: target.serverCode,
      },
    });

    // 3. Create initial Scan record in DB
    const scan = await prisma.scan.create({
      data: {
        targetId: serverTarget.id,
        userId: options.userId,
        status: "connecting",
        scanMode: options.scanMode || "public",
        scannerVersion: "1.0.0",
      },
    });

    const unavailableSources: string[] = [];
    const limitationsNotes: string[] = [
      "Veřejný skener analyzuje pouze data zpřístupněná serverem v HTTP hlavičkách a JSON koncových bodech.",
      "Absence zjištění resource neznamená, že jej server nepoužívá — může být skryt v konfiguraci sv_master1 nebo přejmenován.",
      "Pro garantovaný 100% soupis všech manifestů a scriptů použijte autorizovaný režim 'Authorized Scan'.",
    ];

    try {
      // 4. Fetch metadata according to target type
      await prisma.scan.update({
        where: { id: scan.id },
        data: { status: "fetching_metadata" },
      });

      const metadata: FetchedMetadata = {
        online: false,
        hostname: target.normalizedIdentifier,
        playersCount: 0,
        maxPlayers: 0,
        serverVars: {},
        resources: [],
        sourceEndpoints: {},
        observedAt: new Date().toISOString(),
      };

      if (target.targetType === "ip_port" && target.ip && target.port) {
        // Query info.json, dynamic.json, players.json in parallel
        const [infoRes, dynamicRes, playersRes] = await Promise.all([
          FiveMEndpointClient.fetchInfoJson(target.ip, target.port),
          FiveMEndpointClient.fetchDynamicJson(target.ip, target.port),
          FiveMEndpointClient.fetchPlayersJson(target.ip, target.port),
        ]);

        metadata.sourceEndpoints.infoJson = {
          success: infoRes.success,
          latencyMs: infoRes.latencyMs,
          error: infoRes.error,
        };
        metadata.sourceEndpoints.dynamicJson = {
          success: dynamicRes.success,
          latencyMs: dynamicRes.latencyMs,
          error: dynamicRes.error,
        };
        metadata.sourceEndpoints.playersJson = {
          success: playersRes.success,
          count: playersRes.data ? playersRes.data.length : 0,
          error: playersRes.error,
        };

        if (infoRes.success && infoRes.data) {
          metadata.online = true;
          if (infoRes.data.resources) {
            metadata.resources = infoRes.data.resources;
          }
          if (infoRes.data.vars) {
            metadata.serverVars = infoRes.data.vars;
          }
          if (infoRes.data.server) {
            metadata.serverVersion = infoRes.data.server;
          }
        } else {
          unavailableSources.push("info.json (veřejný seznam resources byl skryt nebo je nedostupný)");
        }

        if (dynamicRes.success && dynamicRes.data) {
          metadata.online = true;
          if (dynamicRes.data.hostname) {
            metadata.hostname = dynamicRes.data.hostname;
          }
          if (dynamicRes.data.clients !== undefined) {
            metadata.playersCount = Number(dynamicRes.data.clients);
          }
          if (dynamicRes.data.sv_maxclients !== undefined) {
            metadata.maxPlayers = Number(dynamicRes.data.sv_maxclients);
          }
          metadata.gameType = dynamicRes.data.gametype;
          metadata.mapName = dynamicRes.data.mapname;
        } else {
          unavailableSources.push("dynamic.json (základní herní stav nedostupný)");
        }

        if (playersRes.success && playersRes.data) {
          metadata.playersCount = Math.max(metadata.playersCount, playersRes.data.length);
        } else {
          unavailableSources.push("players.json (přímý seznam hráčů nedostupný nebo skryt)");
        }
      } else if (target.targetType === "server_id" && target.serverCode) {
        // Query Cfx.re API
        const cfxRes = await FiveMEndpointClient.fetchCfxApi(target.serverCode);
        metadata.sourceEndpoints.cfxApi = {
          success: cfxRes.success,
          latencyMs: cfxRes.latencyMs,
          error: cfxRes.error,
        };

        if (cfxRes.success && cfxRes.data?.Data) {
          metadata.online = true;
          const d = cfxRes.data.Data;
          metadata.hostname = d.hostname || `FiveM Server [${target.serverCode}]`;
          metadata.playersCount = d.clients || 0;
          metadata.maxPlayers = d.sv_maxclients || 32;
          metadata.gameType = d.gametype;
          metadata.mapName = d.mapname;
          metadata.resources = d.resources || [];
          metadata.serverVars = d.vars || {};
          metadata.bannerConnecting = d.banner_connecting;
          metadata.bannerDetail = d.banner_detail;
        } else {
          unavailableSources.push("Cfx.re Frontend API (server nebyl nalezen nebo je v privátním režimu)");
        }
      }

      if (!metadata.online) {
        // Server could not be reached on any endpoint
        await prisma.scan.update({
          where: { id: scan.id },
          data: {
            status: "failed",
            finishedAt: new Date(),
            errorCode: "SERVER_UNREACHABLE",
            errorMessage: "Server neodpovídá na žádném z podporovaných veřejných FiveM endpointů.",
          },
        });

        await prisma.serverTarget.update({
          where: { id: serverTarget.id },
          data: { lastOnlineStatus: false },
        });

        return {
          scanId: scan.id,
          targetId: serverTarget.id,
          normalizedIdentifier: target.normalizedIdentifier,
          displayName: target.normalizedIdentifier,
          status: "failed",
          scanMode: options.scanMode || "public",
          online: false,
          playersCount: 0,
          maxPlayers: 0,
          startedAt: new Date(startTime).toISOString(),
          finishedAt: new Date().toISOString(),
          durationMs: Date.now() - startTime,
          frameworkCount: 0,
          resourceCount: 0,
          systemCount: 0,
          evidenceCount: 0,
          averageConfidence: 0,
          detectedFrameworks: [],
          detectedResources: [],
          detectedSystems: [],
          unavailableSources,
          limitationsNotes: [
            "Cílový server je v tomto okamžiku offline, chráněn firewallem blokujícím HTTP dotazy, nebo má privátní konfiguraci.",
          ],
        };
      }

      // 5. Analysis Phase
      await prisma.scan.update({
        where: { id: scan.id },
        data: { status: "analyzing" },
      });

      const detectedFrameworks = FrameworkDetector.detect(metadata, evidenceEngine);
      const allDetectedScripts = ResourceDetector.detect(metadata, evidenceEngine);

      const detectedAnticheats = ResourceDetector.detectAnticheats(allDetectedScripts);
      const detectedResources = allDetectedScripts.filter((s) => s.resultType === "resource");
      const detectedSystems = allDetectedScripts.filter((s) => s.resultType === "game_system");

      const discordInfo = ResourceDetector.extractDiscord(metadata);
      metadata.discordInfo = discordInfo;

      const allCategorizedResources = ResourceDetector.categorizeAllResources(metadata.resources);

      const allDetections = [...detectedFrameworks, ...allDetectedScripts];

      // 6. Report Generation & Persistence
      await prisma.scan.update({
        where: { id: scan.id },
        data: { status: "generating_report" },
      });

      // Persist results and evidences in DB
      for (const det of allDetections) {
        const resultRecord = await prisma.scanResult.create({
          data: {
            scanId: scan.id,
            resultType: det.resultType,
            name: det.name,
            version: det.version,
            category: det.category,
            verificationStatus: det.verificationStatus,
            confidenceScore: det.confidenceScore,
            summary: det.summary,
          },
        });

        for (const ev of det.evidences) {
          await prisma.evidence.create({
            data: {
              scanId: scan.id,
              resultId: resultRecord.id,
              sourceType: ev.sourceType,
              sourceReference: ev.sourceReference,
              evidenceType: ev.evidenceType,
              description: ev.description,
              rawValue: ev.rawValue,
              verificationStatus: ev.verificationStatus,
            },
          });
        }
      }

      const totalConfidence =
        allDetections.length > 0
          ? Math.round(allDetections.reduce((acc, curr) => acc + curr.confidenceScore, 0) / allDetections.length)
          : 0;

      const finalStatus: ScanStatus = unavailableSources.length > 0 ? "partial" : "completed";

      const summaryPayload: ScanReportSummary = {
        scanId: scan.id,
        targetId: serverTarget.id,
        normalizedIdentifier: target.normalizedIdentifier,
        displayName: metadata.hostname || target.normalizedIdentifier,
        status: finalStatus,
        scanMode: options.scanMode || "public",
        online: true,
        playersCount: metadata.playersCount,
        maxPlayers: metadata.maxPlayers,
        startedAt: new Date(startTime).toISOString(),
        finishedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        frameworkCount: detectedFrameworks.length,
        resourceCount: metadata.resources.length > 0 ? metadata.resources.length : detectedResources.length,
        systemCount: detectedSystems.length,
        evidenceCount: evidenceEngine.getRecords().length,
        averageConfidence: totalConfidence,
        detectedFrameworks,
        detectedResources,
        detectedSystems,
        detectedAnticheats,
        allCategorizedResources,
        discordInfo,
        unavailableSources,
        limitationsNotes,
      };


      await prisma.scan.update({
        where: { id: scan.id },
        data: {
          status: finalStatus,
          finishedAt: new Date(),
          rawData: JSON.stringify(metadata),
          summaryJson: JSON.stringify(summaryPayload),
        },
      });

      await prisma.serverTarget.update({
        where: { id: serverTarget.id },
        data: {
          displayName: metadata.hostname || serverTarget.displayName,
          lastOnlineStatus: true,
          lastPlayers: metadata.playersCount,
          lastMaxPlayers: metadata.maxPlayers,
        },
      });

      return summaryPayload;
    } catch (err: any) {
      await prisma.scan.update({
        where: { id: scan.id },
        data: {
          status: "failed",
          finishedAt: new Date(),
          errorCode: "SCANNER_INTERNAL_ERROR",
          errorMessage: err.message || "Neočekávaná chyba při provádění analýzy.",
        },
      });
      throw err;
    }
  }
}
