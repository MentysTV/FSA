import dns from "node:dns/promises";
import net from "node:net";

export interface SSRFValidationResult {
  valid: boolean;
  resolvedIp?: string;
  error?: string;
}

/**
 * Checks if an IPv4 address is in a private, loopback, or reserved range.
 */
function isPrivateIPv4(ip: string): boolean {
  // Normalize dotted decimal
  const parts = ip.split(".").map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed is rejected
  }

  const [a, b, c, d] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 10.0.0.0/8 (Private)
  if (a === 10) return true;

  // 172.16.0.0/12 (Private: 172.16.0.0 - 172.31.255.255)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (Link-local, including Cloud Metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 100.64.0.0/10 (Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  // 192.0.0.0/24 (IETF Protocol Assignments)
  if (a === 192 && b === 0 && c === 0) return true;

  // 198.18.0.0/15 (Network benchmark tests)
  if (a === 198 && (b === 18 || b === 19)) return true;

  // 224.0.0.0/4 (Multicast: 224-239)
  if (a >= 224 && a <= 239) return true;

  // 240.0.0.0/4 (Reserved / Future use / Broadcast)
  if (a >= 240) return true;

  // 255.255.255.255 (Broadcast)
  if (a === 255 && b === 255 && c === 255 && d === 255) return true;

  return false;
}

/**
 * Checks if an IPv6 address is in a private, loopback, or reserved range.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();

  // ::1 (Loopback)
  if (normalized === "::1" || normalized === "0000:0000:0000:0000:0000:0000:0000:0001") {
    return true;
  }

  // :: (Unspecified)
  if (normalized === "::") return true;

  // IPv4-mapped IPv6 (e.g., ::ffff:127.0.0.1 or ::ffff:7f00:1)
  if (normalized.includes("::ffff:")) {
    const ipv4Part = normalized.split("::ffff:")[1];
    if (ipv4Part && net.isIPv4(ipv4Part)) {
      return isPrivateIPv4(ipv4Part);
    }
  }

  // fe80::/10 (Link-local)
  if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) {
    return true;
  }

  // fc00::/7 (Unique Local Address - ULA, fc00:: to fdff::)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) {
    return true;
  }

  // ff00::/8 (Multicast)
  if (normalized.startsWith("ff")) {
    return true;
  }

  return false;
}

/**
 * Validates a hostname or IP address strictly against SSRF attacks.
 */
export async function validateHostSSRF(host: string): Promise<SSRFValidationResult> {
  const sanitized = host.trim().toLowerCase();

  // Block localhost / internal domain aliases immediately
  const blockedHostnames = [
    "localhost",
    "metadata.google.internal",
    "metadata.internal",
    "instance-data",
    "kubernetes.default",
    "vault.local",
    "consul.local",
  ];

  if (blockedHostnames.includes(sanitized) || sanitized.endsWith(".internal") || sanitized.endsWith(".local") || sanitized.endsWith(".localhost")) {
    return { valid: false, error: "SSRF_BLOCKED: Interní a lokální doménová jména jsou zakázána." };
  }

  let resolvedIp: string;

  // Direct IP check
  if (net.isIP(sanitized)) {
    resolvedIp = sanitized;
  } else {
    // Resolve DNS and verify every returned address (DNS Rebinding prevention)
    try {
      const records = await dns.lookup(sanitized, { all: true });
      if (!records || records.length === 0) {
        return { valid: false, error: "DNS_RESOLUTION_FAILED: Host se nepodařilo přeložit." };
      }

      for (const rec of records) {
        if (rec.family === 4 && isPrivateIPv4(rec.address)) {
          return { valid: false, error: `SSRF_BLOCKED: Doména ukazuje na privátní IPv4 rozsah (${rec.address}).` };
        }
        if (rec.family === 6 && isPrivateIPv6(rec.address)) {
          return { valid: false, error: `SSRF_BLOCKED: Doména ukazuje na privátní IPv6 rozsah (${rec.address}).` };
        }
      }

      resolvedIp = records[0].address;
    } catch {
      return { valid: false, error: "DNS_RESOLUTION_FAILED: Chyba při překladu domény." };
    }
  }

  // Check the resolved IP
  if (net.isIPv4(resolvedIp) && isPrivateIPv4(resolvedIp)) {
    return { valid: false, error: `SSRF_BLOCKED: Cílová adresa ${resolvedIp} spadá do privátního nebo vyhrazeného rozsahu.` };
  }

  if (net.isIPv6(resolvedIp) && isPrivateIPv6(resolvedIp)) {
    return { valid: false, error: `SSRF_BLOCKED: Cílová adresa ${resolvedIp} spadá do privátního IPv6 rozsahu.` };
  }

  return { valid: true, resolvedIp };
}
