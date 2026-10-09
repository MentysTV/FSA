import crypto from "node:crypto";
import { EvidenceRecord, VerificationStatus } from "./types";

export class EvidenceEngine {
  private records: EvidenceRecord[] = [];

  addEvidence(params: {
    sourceType: EvidenceRecord["sourceType"];
    sourceReference: string;
    evidenceType: EvidenceRecord["evidenceType"];
    description: string;
    rawValue?: string;
    verificationStatus?: VerificationStatus;
  }): EvidenceRecord {
    const id = `evi_${crypto.randomUUID().substring(0, 8)}`;
    const sanitizedRaw = params.rawValue
      ? params.rawValue.length > 500
        ? params.rawValue.substring(0, 500) + "... [truncated]"
        : params.rawValue
      : undefined;

    const record: EvidenceRecord = {
      id,
      sourceType: params.sourceType,
      sourceReference: params.sourceReference,
      evidenceType: params.evidenceType,
      description: params.description,
      rawValue: sanitizedRaw,
      verificationStatus: params.verificationStatus || "confirmed",
      observedAt: new Date().toISOString(),
    };

    this.records.push(record);
    return record;
  }

  getRecords(): EvidenceRecord[] {
    return [...this.records];
  }

  clear() {
    this.records = [];
  }
}
