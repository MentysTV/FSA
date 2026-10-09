import { EvidenceEngine } from "./evidence-engine";
import { ConfidenceEngine } from "./confidence-engine";
import { FetchedMetadata, TechnologyDetection } from "./types";

export class FrameworkDetector {
  /**
   * Analyzes server metadata and resources for known FiveM core frameworks.
   */
  static detect(metadata: FetchedMetadata, evidenceEngine: EvidenceEngine): TechnologyDetection[] {
    const results: TechnologyDetection[] = [];
    const resources = metadata.resources.map((r) => r.toLowerCase());
    const vars = metadata.serverVars;
    const hostname = (metadata.hostname || "").toLowerCase();
    const gametype = (metadata.gameType || "").toLowerCase();

    // 1. ESX Legacy / ESX
    const esxEvidences = [];
    // Check direct resource entries
    const esExtended = resources.find((r) => r === "es_extended");
    if (esExtended) {
      esxEvidences.push(
        evidenceEngine.addEvidence({
          sourceType: "info_json",
          sourceReference: "resources[]",
          evidenceType: "resource_entry",
          description: "Nalezen klíčový resource jádra ESX: 'es_extended'",
          rawValue: "es_extended",
        })
      );
    }
    // Check server vars for esx
    for (const [k, v] of Object.entries(vars)) {
      if (k.toLowerCase().includes("esx") || String(v).toLowerCase().includes("esx")) {
        esxEvidences.push(
          evidenceEngine.addEvidence({
            sourceType: "info_json",
            sourceReference: `vars.${k}`,
            evidenceType: "server_var",
            description: `Serverová proměnná indikující ESX: ${k} = ${v}`,
            rawValue: `${k}: ${v}`,
          })
        );
      }
    }
    // Check tags/hostname only as supplementary weak evidence
    if (hostname.includes("esx") || gametype.includes("esx")) {
      esxEvidences.push(
        evidenceEngine.addEvidence({
          sourceType: "dynamic_json",
          sourceReference: "hostname/gametype",
          evidenceType: "meta_tag",
          description: "Výskyt značky 'ESX' v názvu serveru nebo typu hry",
          rawValue: `gametype: ${gametype}`,
        })
      );
    }

    if (esxEvidences.length > 0) {
      const conf = ConfidenceEngine.calculate(esxEvidences);
      results.push({
        slug: "esx-legacy",
        name: "ESX Legacy Framework",
        category: "core",
        resultType: "framework",
        version: vars["esx_version"] ? String(vars["esx_version"]) : undefined,
        verificationStatus: conf.status,
        confidenceScore: conf.score,
        summary: `Detekován framework ESX Legacy (${conf.statusLabelCs}). ${conf.explanation}`,
        evidences: esxEvidences,
      });
    }

    // 2. QBCore
    const qbEvidences = [];
    const qbCoreRes = resources.find((r) => r === "qb-core" || r === "qb_core");
    if (qbCoreRes) {
      qbEvidences.push(
        evidenceEngine.addEvidence({
          sourceType: "info_json",
          sourceReference: "resources[]",
          evidenceType: "resource_entry",
          description: `Nalezen základní core resource: '${qbCoreRes}'`,
          rawValue: qbCoreRes,
        })
      );
    }
    for (const [k, v] of Object.entries(vars)) {
      if (
        k.toLowerCase().includes("qbcore") ||
        k.toLowerCase().includes("qb-core") ||
        k.toLowerCase().startsWith("qb_")
      ) {
        qbEvidences.push(
          evidenceEngine.addEvidence({
            sourceType: "info_json",
            sourceReference: `vars.${k}`,
            evidenceType: "server_var",
            description: `Serverová proměnná QBCore: ${k} = ${v}`,
            rawValue: `${k}: ${v}`,
          })
        );
      }
    }
    if (hostname.includes("qbcore") || hostname.includes("qb-core") || gametype.includes("qbcore")) {
      qbEvidences.push(
        evidenceEngine.addEvidence({
          sourceType: "dynamic_json",
          sourceReference: "hostname/gametype",
          evidenceType: "meta_tag",
          description: "Výskyt označení QBCore v metadatech",
          rawValue: hostname,
        })
      );
    }

    if (qbEvidences.length > 0) {
      const conf = ConfidenceEngine.calculate(qbEvidences);
      results.push({
        slug: "qb-core",
        name: "QBCore Framework",
        category: "core",
        resultType: "framework",
        version: vars["qb_version"] ? String(vars["qb_version"]) : undefined,
        verificationStatus: conf.status,
        confidenceScore: conf.score,
        summary: `Detekován framework QBCore (${conf.statusLabelCs}). ${conf.explanation}`,
        evidences: qbEvidences,
      });
    }

    // 3. Qbox Framework
    const qboxEvidences = [];
    const qbxCoreRes = resources.find((r) => r === "qbx_core" || r === "qbx-core");
    if (qbxCoreRes) {
      qboxEvidences.push(
        evidenceEngine.addEvidence({
          sourceType: "info_json",
          sourceReference: "resources[]",
          evidenceType: "resource_entry",
          description: "Nalezen oficiální resource jádra Qbox: 'qbx_core'",
          rawValue: qbxCoreRes,
        })
      );
    }
    if (qboxEvidences.length > 0) {
      const conf = ConfidenceEngine.calculate(qboxEvidences);
      results.push({
        slug: "qbox",
        name: "Qbox Project Framework",
        category: "core",
        resultType: "framework",
        verificationStatus: conf.status,
        confidenceScore: conf.score,
        summary: `Detekován moderní modularní framework Qbox (${conf.statusLabelCs}). ${conf.explanation}`,
        evidences: qboxEvidences,
      });
    }

    // 4. vRP Framework
    const vrpEvidences = [];
    const vrpRes = resources.find((r) => r === "vrp");
    if (vrpRes) {
      vrpEvidences.push(
        evidenceEngine.addEvidence({
          sourceType: "info_json",
          sourceReference: "resources[]",
          evidenceType: "resource_entry",
          description: "Nalezen resource jádra vRP: 'vrp'",
          rawValue: "vrp",
        })
      );
    }
    if (vrpEvidences.length > 0) {
      const conf = ConfidenceEngine.calculate(vrpEvidences);
      results.push({
        slug: "vrp",
        name: "vRP Framework",
        category: "core",
        resultType: "framework",
        verificationStatus: conf.status,
        confidenceScore: conf.score,
        summary: `Detekován legacy framework vRP (${conf.statusLabelCs}). ${conf.explanation}`,
        evidences: vrpEvidences,
      });
    }

    // 5. ox_lib (Core Library)
    const oxLibEvidences = [];
    const oxLibRes = resources.find((r) => r === "ox_lib");
    if (oxLibRes) {
      oxLibEvidences.push(
        evidenceEngine.addEvidence({
          sourceType: "info_json",
          sourceReference: "resources[]",
          evidenceType: "resource_entry",
          description: "Nalezena klíčová knihovna 'ox_lib' od Overextended",
          rawValue: "ox_lib",
        })
      );
    }
    if (oxLibEvidences.length > 0) {
      const conf = ConfidenceEngine.calculate(oxLibEvidences);
      results.push({
        slug: "ox_lib",
        name: "ox_lib (Overextended Library)",
        category: "core",
        resultType: "framework",
        verificationStatus: conf.status,
        confidenceScore: conf.score,
        summary: `Detekována základní knihovna ox_lib (${conf.statusLabelCs}).`,
        evidences: oxLibEvidences,
      });
    }

    return results;
  }
}
