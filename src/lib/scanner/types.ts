export type ScanMode = "public" | "authorized";

export type ScanStatus =
  | "queued"
  | "validating"
  | "connecting"
  | "fetching_metadata"
  | "analyzing"
  | "generating_report"
  | "completed"
  | "partial"
  | "failed"
  | "cancelled";

export type VerificationStatus =
  | "confirmed"
  | "strong_evidence"
  | "weak_evidence"
  | "unverified"
  | "not_detected";

export interface TargetInput {
  raw: string;
  targetType: "ip_port" | "server_id";
  ip?: string;
  port?: number;
  serverCode?: string;
  normalizedIdentifier: string;
}

export interface FiveMInfoJson {
  server?: string;
  enhancedHostSupport?: boolean;
  resources?: string[];
  vars?: Record<string, string | number | boolean>;
  version?: number;
}

export interface FiveMDynamicJson {
  hostname?: string;
  clients?: number;
  sv_maxclients?: number | string;
  gametype?: string;
  mapname?: string;
  iv?: string;
}

export interface FiveMPlayer {
  endpoint?: string;
  id?: number;
  identifiers?: string[];
  name?: string;
  ping?: number;
}

export interface CfxApiResponse {
  Data?: {
    hostname?: string;
    clients?: number;
    sv_maxclients?: number;
    vars?: Record<string, any>;
    resources?: string[];
    connectEndPoints?: string[];
    gametype?: string;
    mapname?: string;
    tags?: string;
    ownerName?: string;
    ownerProfile?: string;
    private?: boolean;
    banner_connecting?: string;
    banner_detail?: string;
  };
}

export interface FetchedMetadata {
  online: boolean;
  hostname: string;
  playersCount: number;
  maxPlayers: number;
  gameType?: string;
  mapName?: string;
  serverVersion?: string;
  serverVars: Record<string, any>;
  resources: string[];
  bannerConnecting?: string;
  bannerDetail?: string;
  sourceEndpoints: {
    infoJson?: { success: boolean; latencyMs?: number; error?: string };
    dynamicJson?: { success: boolean; latencyMs?: number; error?: string };
    playersJson?: { success: boolean; count?: number; error?: string };
    cfxApi?: { success: boolean; latencyMs?: number; error?: string };
    authorizedAgent?: { success: boolean; receivedAt?: string };
  };
  observedAt: string;
  discordInfo?: DiscordInfo;
}

export interface DiscordInfo {
  found: boolean;
  inviteUrl?: string;
  inviteCode?: string;
  source?: string;
}

export interface CategorizedResource {
  name: string;
  category: string;
  categoryLabel: string;
  type:
    | "anticheat"
    | "mlo"
    | "vehicle"
    | "clothing"
    | "framework"
    | "inventory"
    | "phone"
    | "job"
    | "gameplay"
    | "standalone"
    | "other";
  description?: string;
  isAnticheat?: boolean;
  isMlo?: boolean;
}

export interface EvidenceRecord {
  id: string;
  sourceType:
    | "info_json"
    | "dynamic_json"
    | "players_json"
    | "cfx_api"
    | "authorized_agent"
    | "public_docs";
  sourceReference: string;
  evidenceType: "resource_entry" | "server_var" | "meta_tag" | "manifest_signature" | "banner_match";
  description: string;
  rawValue?: string;
  verificationStatus: VerificationStatus;
  observedAt: string;
}

export interface TechnologyDetection {
  slug: string;
  name: string;
  category: string;
  resultType: "framework" | "resource" | "game_system";
  version?: string;
  verificationStatus: VerificationStatus;
  confidenceScore: number;
  summary: string;
  evidences: EvidenceRecord[];
}

export interface ScanReportSummary {
  scanId: string;
  targetId: string;
  normalizedIdentifier: string;
  displayName: string;
  status: ScanStatus;
  scanMode: ScanMode;
  online: boolean;
  playersCount: number;
  maxPlayers: number;
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  frameworkCount: number;
  resourceCount: number;
  systemCount: number;
  evidenceCount: number;
  averageConfidence: number;
  detectedFrameworks: TechnologyDetection[];
  detectedResources: TechnologyDetection[];
  detectedSystems: TechnologyDetection[];
  detectedAnticheats: TechnologyDetection[];
  allCategorizedResources: CategorizedResource[];
  discordInfo?: DiscordInfo;
  unavailableSources: string[];
  limitationsNotes: string[];
}

