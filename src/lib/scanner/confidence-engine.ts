import { EvidenceRecord, VerificationStatus } from "./types";

export interface ConfidenceCalculation {
  score: number;
  status: VerificationStatus;
  statusLabelCs: string;
  explanation: string;
}

export class ConfidenceEngine {
  /**
   * Evaluates deterministic confidence score based on the weight of collected evidences.
   */
  static calculate(evidences: EvidenceRecord[]): ConfidenceCalculation {
    if (!evidences || evidences.length === 0) {
      return {
        score: 0,
        status: "not_detected",
        statusLabelCs: "Nezjištěno",
        explanation: "Nebyly nalezeny žádné doložitelné důkazy v dostupných veřejných datech.",
      };
    }

    let maxScore = 0;
    let hasAuthorized = false;
    let hasDirectResource = false;
    let hasExplicitVar = false;
    let hasTagOnly = false;

    for (const ev of evidences) {
      if (ev.sourceType === "authorized_agent") {
        hasAuthorized = true;
        maxScore = Math.max(maxScore, 100);
      } else if (ev.evidenceType === "resource_entry") {
        hasDirectResource = true;
        // Direct entry in resources array of public info.json or Cfx API
        maxScore = Math.max(maxScore, 85);
      } else if (ev.evidenceType === "server_var") {
        hasExplicitVar = true;
        // Explicit server variable (e.g. esx_version, qb_version)
        maxScore = Math.max(maxScore, 80);
      } else if (ev.evidenceType === "meta_tag" || ev.evidenceType === "banner_match") {
        hasTagOnly = true;
        maxScore = Math.max(maxScore, 45);
      }
    }

    // Boost score if corroborated by multiple distinct evidence sources
    if (evidences.length >= 2 && !hasAuthorized) {
      if (hasDirectResource && hasExplicitVar) {
        maxScore = Math.min(95, maxScore + 10);
      } else if ((hasDirectResource || hasExplicitVar) && hasTagOnly) {
        maxScore = Math.min(90, maxScore + 5);
      }
    }

    let status: VerificationStatus;
    let statusLabelCs: string;
    let explanation: string;

    if (maxScore >= 95) {
      status = "confirmed";
      statusLabelCs = "Potvrzeno";
      explanation =
        hasAuthorized
          ? "Přímo ověřeno skrze autorizovaný FiveM serverový agent s exportem manifestu."
          : "Potvrzeno vícenásobnými přímými důkazy (seznam resources i explicitní proměnné serveru).";
    } else if (maxScore >= 75) {
      status = "strong_evidence";
      statusLabelCs = "Silné důkazy";
      explanation = hasDirectResource
        ? "Konkrétní resource je explicitně uveden ve veřejném seznamu resources serveru."
        : "Server vystavuje explicitní konfigurační proměnnou příslušné technologie.";
    } else if (maxScore >= 35) {
      status = "weak_evidence";
      statusLabelCs = "Slabé důkazy";
      explanation =
        "Technologie byla zmíněna pouze v komunitních tazích, názvu serveru nebo popisu, bez přímého záznamu v resources.";
    } else {
      status = "unverified";
      statusLabelCs = "Neověřeno";
      explanation = "Nalezeny pouze nepřímé a nejednoznačné indicie.";
    }

    return {
      score: maxScore,
      status,
      statusLabelCs,
      explanation,
    };
  }
}
