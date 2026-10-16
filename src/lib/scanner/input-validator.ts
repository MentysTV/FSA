import { TargetInput } from "./types";
import { validateHostSSRF } from "./ssrf-guard";

export interface ValidationResult {
  valid: boolean;
  target?: TargetInput;
  error?: string;
}

export async function parseAndValidateTarget(input: string): Promise<ValidationResult> {
  let trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: "Zadejte IP adresu s portem nebo kód FiveM serveru." };
  }

  // Strip F8 prefix and connect commands (e.g. "connect cfx.re/join/xxxxxx", "connect 185.100.200.45:30120", "f8: connect xxx")
  trimmed = trimmed.replace(/^["'`\[\(]+|["'`\]\)]+$/g, "").trim();
  trimmed = trimmed.replace(/^f8\s*[:\-]?\s*/i, "");
  trimmed = trimmed.replace(/^fivem:\/\/(?:connect\/)?/i, "");
  trimmed = trimmed.replace(/^connect\s+/i, "");
  trimmed = trimmed.replace(/^["'`\[\(]+|["'`\]\)]+$/g, "").trim();

  if (!trimmed) {
    return { valid: false, error: "Zadejte IP adresu s portem nebo kód FiveM serveru." };
  }

  // Check if it's a Cfx.re join URL or code
  // Examples: "cfx.re/join/k8x9pq", "https://cfx.re/join/k8x9pq", "servers.fivem.net/servers/detail/k8x9pq", "k8x9pq"
  const cfxUrlMatch = trimmed.match(/(?:cfx\.re\/join\/|servers\.fivem\.net\/servers\/detail\/)([a-zA-Z0-9]+)/i);
  if (cfxUrlMatch && cfxUrlMatch[1]) {
    const code = cfxUrlMatch[1].toLowerCase();
    return {
      valid: true,
      target: {
        raw: trimmed,
        targetType: "server_id",
        serverCode: code,
        normalizedIdentifier: `cfx:${code}`,
      },
    };
  }

  // Direct alphanumeric code without dots or colons: 5 to 10 chars
  if (/^[a-zA-Z0-9]{5,10}$/.test(trimmed)) {
    const code = trimmed.toLowerCase();
    return {
      valid: true,
      target: {
        raw: trimmed,
        targetType: "server_id",
        serverCode: code,
        normalizedIdentifier: `cfx:${code}`,
      },
    };
  }

  // IPv6 with port: [2001:db8::1]:30120
  const ipv6WithPortMatch = trimmed.match(/^\[([a-fA-F0-9:]+)\]:(\d+)$/);
  if (ipv6WithPortMatch) {
    const ip = ipv6WithPortMatch[1];
    const port = parseInt(ipv6WithPortMatch[2], 10);
    if (port < 1 || port > 65535) {
      return { valid: false, error: "Port musí být v rozsahu 1 až 65535." };
    }
    const ssrfCheck = await validateHostSSRF(ip);
    if (!ssrfCheck.valid) {
      return { valid: false, error: ssrfCheck.error };
    }
    return {
      valid: true,
      target: {
        raw: trimmed,
        targetType: "ip_port",
        ip: ssrfCheck.resolvedIp || ip,
        port,
        normalizedIdentifier: `[${ip}]:${port}`,
      },
    };
  }

  // IPv4 or domain with port or standalone
  // e.g. "185.220.100.5:30120" or "play.server.cz:30120" or "185.220.100.5"
  let hostPart = trimmed;
  let port = 30120; // Default FiveM port

  if (trimmed.includes(":")) {
    const lastColonIdx = trimmed.lastIndexOf(":");
    hostPart = trimmed.substring(0, lastColonIdx);
    const portStr = trimmed.substring(lastColonIdx + 1);
    const parsedPort = parseInt(portStr, 10);
    if (isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
      return { valid: false, error: "Neplatný formát portu (povolený rozsah 1-65535)." };
    }
    port = parsedPort;
  }

  // Clean protocol if user pasted "http://185.220.100.5:30120"
  hostPart = hostPart.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");

  const ssrfCheck = await validateHostSSRF(hostPart);
  if (!ssrfCheck.valid) {
    return { valid: false, error: ssrfCheck.error };
  }

  return {
    valid: true,
    target: {
      raw: trimmed,
      targetType: "ip_port",
      ip: ssrfCheck.resolvedIp || hostPart,
      port,
      normalizedIdentifier: `${hostPart}:${port}`,
    },
  };
}
