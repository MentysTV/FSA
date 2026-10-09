import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { EvidenceEngine } from "@/lib/scanner/evidence-engine";
import { KNOWN_CATALOG_RESOURCES } from "@/lib/scanner/resource-detector";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Chybí platná autorizační hlavička." }, { status: 401 });
    }

    const rawToken = authHeader.replace("Bearer ", "").trim();
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const integration = await prisma.authorizedIntegration.findUnique({
      where: { tokenHash },
      include: { target: true },
    });

    if (!integration || integration.status !== "active") {
      return NextResponse.json(
        { error: "Neplatný nebo zneplatněný API token." },
        { status: 403 }
      );
    }

    const payload = await req.json();
    const { hostname, maxClients, clients, resources = [], framework } = payload;

    // Update integration lastSeenAt
    await prisma.authorizedIntegration.update({
      where: { id: integration.id },
      data: { lastSeenAt: new Date() },
    });

    const target = integration.target;
    const evidenceEngine = new EvidenceEngine();

    // Create Authorized Scan
    const scan = await prisma.scan.create({
      data: {
        targetId: target.id,
        userId: integration.ownerId,
        status: "completed",
        scanMode: "authorized",
        startedAt: new Date(),
        finishedAt: new Date(),
        scannerVersion: "1.0.0-agent",
      },
    });

    // 1. Framework detection with 100% confidence
    const detectedFrameworks = [];
    if (framework) {
      const fwEv = evidenceEngine.addEvidence({
        sourceType: "authorized_agent",
        sourceReference: "fsd_agent::GetResourceState()",
        evidenceType: "manifest_signature",
        description: `Autorizovaný agent ověřil spuštěné jádro serveru: ${framework}`,
        rawValue: framework,
        verificationStatus: "confirmed",
      });

      const fwRecord = await prisma.scanResult.create({
        data: {
          scanId: scan.id,
          resultType: "framework",
          name: framework,
          category: "core",
          verificationStatus: "confirmed",
          confidenceScore: 100,
          summary: `Přímo potvrzeno autorizovaným exportem ze serveru (${framework}).`,
        },
      });

      await prisma.evidence.create({
        data: {
          scanId: scan.id,
          resultId: fwRecord.id,
          sourceType: fwEv.sourceType,
          sourceReference: fwEv.sourceReference,
          evidenceType: fwEv.evidenceType,
          description: fwEv.description,
          rawValue: fwEv.rawValue,
          verificationStatus: "confirmed",
        },
      });

      detectedFrameworks.push({
        slug: framework.toLowerCase().replace(/\s+/g, "-"),
        name: framework,
        category: "core",
        resultType: "framework",
        verificationStatus: "confirmed",
        confidenceScore: 100,
        summary: `Přímo potvrzeno autorizovaným exportem ze serveru (${framework}).`,
        evidences: [fwEv],
      });
    }

    // 2. Resources detection
    const normalizedResList: string[] = resources.map((r: string) => r.toLowerCase());
    const detectedResources = [];
    const detectedSystems = [];

    for (const item of KNOWN_CATALOG_RESOURCES) {
      const found = item.aliases.find((a) => normalizedResList.includes(a.toLowerCase()));
      if (found) {
        const ev = evidenceEngine.addEvidence({
          sourceType: "authorized_agent",
          sourceReference: "fsd_agent::GetNumResources()",
          evidenceType: "resource_entry",
          description: `Autorizovaný agent potvrdil běžící resource: '${found}'`,
          rawValue: found,
          verificationStatus: "confirmed",
        });

        const resRecord = await prisma.scanResult.create({
          data: {
            scanId: scan.id,
            resultType: item.resultType,
            name: item.name,
            category: item.category,
            verificationStatus: "confirmed",
            confidenceScore: 100,
            summary: `${item.description} (Autorizovaně potvrzeno)`,
          },
        });

        await prisma.evidence.create({
          data: {
            scanId: scan.id,
            resultId: resRecord.id,
            sourceType: ev.sourceType,
            sourceReference: ev.sourceReference,
            evidenceType: ev.evidenceType,
            description: ev.description,
            rawValue: ev.rawValue,
            verificationStatus: "confirmed",
          },
        });

        const entry = {
          slug: item.slug,
          name: item.name,
          category: item.category,
          resultType: item.resultType,
          verificationStatus: "confirmed" as const,
          confidenceScore: 100,
          summary: `${item.description} (Autorizovaně potvrzeno)`,
          evidences: [ev],
        };

        if (item.resultType === "resource") {
          detectedResources.push(entry);
        } else {
          detectedSystems.push(entry);
        }
      }
    }

    const summaryPayload = {
      scanId: scan.id,
      targetId: target.id,
      normalizedIdentifier: target.normalizedIdentifier,
      displayName: hostname || target.displayName,
      status: "completed",
      scanMode: "authorized",
      online: true,
      playersCount: clients || 0,
      maxPlayers: maxClients || 32,
      startedAt: scan.startedAt.toISOString(),
      finishedAt: scan.finishedAt?.toISOString(),
      durationMs: 120,
      frameworkCount: detectedFrameworks.length,
      resourceCount: detectedResources.length,
      systemCount: detectedSystems.length,
      evidenceCount: evidenceEngine.getRecords().length,
      averageConfidence: 100,
      detectedFrameworks,
      detectedResources,
      detectedSystems,
      unavailableSources: [],
      limitationsNotes: [
        "Data pocházejí z ověřené autorizované synchronizace se serverovým agentem fsd_agent.",
        "Zveřejněny byly pouze resources schválené majitelem serveru v konfiguračním souboru.",
      ],
    };

    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        summaryJson: JSON.stringify(summaryPayload),
        rawData: JSON.stringify(payload),
      },
    });

    await prisma.serverTarget.update({
      where: { id: target.id },
      data: {
        displayName: hostname || target.displayName,
        lastOnlineStatus: true,
        lastPlayers: clients || 0,
        lastMaxPlayers: maxClients || 32,
      },
    });

    return NextResponse.json({
      success: true,
      scanId: scan.id,
      message: "Autorizovaná telemetrie byla úspěšně zpracována a report vytvořen.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
