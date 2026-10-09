import { FiveMInfoJson, FiveMDynamicJson, FiveMPlayer, CfxApiResponse } from "./types";

const TIMEOUT_MS = Number(process.env.SCANNER_TIMEOUT_MS) || 6000;
const MAX_BYTES = Number(process.env.SCANNER_MAX_RESPONSE_BYTES) || 2 * 1024 * 1024; // 2MB
const USER_AGENT = "FSD-Scanner-PRO/1.0 (FiveM Metadata Inspector; Security-Compliant)";

export interface FetchResult<T> {
  success: boolean;
  data?: T;
  latencyMs?: number;
  statusCode?: number;
  error?: string;
}

/**
 * Safely fetches an HTTP endpoint with strict size and timeout boundaries.
 */
async function safeFetchJson<T>(url: string): Promise<FetchResult<T>> {
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      cache: "no-store",
      redirect: "manual", // Do not follow redirects blindly (SSRF mitigation)
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - start;

    if (!res.ok) {
      return {
        success: false,
        statusCode: res.status,
        latencyMs,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    // Read with size cap
    if (!res.body) {
      return { success: false, latencyMs, error: "Empty response body" };
    }

    const reader = res.body.getReader();
    let receivedBytes = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        receivedBytes += value.length;
        if (receivedBytes > MAX_BYTES) {
          reader.cancel();
          return {
            success: false,
            latencyMs,
            error: `Odpověď překročila maximální povolenou velikost (${MAX_BYTES} B).`,
          };
        }
        chunks.push(value);
      }
    }

    const totalBuffer = new Uint8Array(receivedBytes);
    let offset = 0;
    for (const chunk of chunks) {
      totalBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    const text = new TextDecoder("utf-8").decode(totalBuffer);
    if (!text.trim()) {
      return { success: false, latencyMs, error: "Odpověď byla prázdná." };
    }

    try {
      const parsed = JSON.parse(text) as T;
      return { success: true, data: parsed, latencyMs, statusCode: res.status };
    } catch {
      return { success: false, latencyMs, error: "Neplatný formát JSON v odpovědi." };
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    const latencyMs = Date.now() - start;
    if (err.name === "AbortError") {
      return { success: false, latencyMs, error: `Požadavek vypršel (časový limit ${TIMEOUT_MS}ms).` };
    }
    return { success: false, latencyMs, error: err.message || "Chyba síťového spojení." };
  }
}

export class FiveMEndpointClient {
  /**
   * Fetches /info.json from an IP:port
   */
  static async fetchInfoJson(ip: string, port: number): Promise<FetchResult<FiveMInfoJson>> {
    const url = `http://${ip}:${port}/info.json`;
    return safeFetchJson<FiveMInfoJson>(url);
  }

  /**
   * Fetches /dynamic.json from an IP:port
   */
  static async fetchDynamicJson(ip: string, port: number): Promise<FetchResult<FiveMDynamicJson>> {
    const url = `http://${ip}:${port}/dynamic.json`;
    return safeFetchJson<FiveMDynamicJson>(url);
  }

  /**
   * Fetches /players.json from an IP:port
   */
  static async fetchPlayersJson(ip: string, port: number): Promise<FetchResult<FiveMPlayer[]>> {
    const url = `http://${ip}:${port}/players.json`;
    return safeFetchJson<FiveMPlayer[]>(url);
  }

  /**
   * Fetches Cfx.re master directory API for single server
   */
  static async fetchCfxApi(serverCode: string): Promise<FetchResult<CfxApiResponse>> {
    const url = `https://servers-frontend.fivem.net/api/servers/single/${serverCode}`;
    return safeFetchJson<CfxApiResponse>(url);
  }
}
