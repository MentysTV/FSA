import assert from "node:assert";
import { validateHostSSRF } from "../src/lib/scanner/ssrf-guard";
import { parseAndValidateTarget } from "../src/lib/scanner/input-validator";
import { ConfidenceEngine } from "../src/lib/scanner/confidence-engine";
import { EvidenceEngine } from "../src/lib/scanner/evidence-engine";
import { FrameworkDetector } from "../src/lib/scanner/framework-detector";
import { ResourceDetector } from "../src/lib/scanner/resource-detector";
import { FetchedMetadata } from "../src/lib/scanner/types";

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
    failed++;
  }
}

async function runAllTests() {
  console.log("==================================================");
  console.log("  FSD PRO (FiveM Script Detector) Test Suite");
  console.log("==================================================");

  console.log("\n[1] Security & SSRF Protection Tests:");

  await test("Rejects localhost hostname", async () => {
    const res = await validateHostSSRF("localhost");
    assert.strictEqual(res.valid, false);
    assert.ok(res.error?.includes("SSRF_BLOCKED"));
  });

  await test("Rejects IPv4 loopback (127.0.0.1)", async () => {
    const res = await validateHostSSRF("127.0.0.1");
    assert.strictEqual(res.valid, false);
    assert.ok(res.error?.includes("SSRF_BLOCKED"));
  });

  await test("Rejects alternate loopback (127.12.34.56)", async () => {
    const res = await validateHostSSRF("127.12.34.56");
    assert.strictEqual(res.valid, false);
  });

  await test("Rejects Cloud Metadata IP (169.254.169.254)", async () => {
    const res = await validateHostSSRF("169.254.169.254");
    assert.strictEqual(res.valid, false);
  });

  await test("Rejects RFC1918 Private Class A (10.0.5.1)", async () => {
    const res = await validateHostSSRF("10.0.5.1");
    assert.strictEqual(res.valid, false);
  });

  await test("Rejects RFC1918 Private Class B (172.16.1.10)", async () => {
    const res = await validateHostSSRF("172.16.1.10");
    assert.strictEqual(res.valid, false);
  });

  await test("Rejects RFC1918 Private Class C (192.168.1.1)", async () => {
    const res = await validateHostSSRF("192.168.1.1");
    assert.strictEqual(res.valid, false);
  });

  await test("Rejects IPv6 loopback (::1)", async () => {
    const res = await validateHostSSRF("::1");
    assert.strictEqual(res.valid, false);
  });

  await test("Rejects IPv4-mapped IPv6 loopback (::ffff:127.0.0.1)", async () => {
    const res = await validateHostSSRF("::ffff:127.0.0.1");
    assert.strictEqual(res.valid, false);
  });

  await test("Accepts public routable IP (185.100.200.45)", async () => {
    const res = await validateHostSSRF("185.100.200.45");
    assert.strictEqual(res.valid, true);
  });

  console.log("\n[2] Input Validator & Port Parsing Tests:");

  await test("Parses valid IP:port correctly", async () => {
    const res = await parseAndValidateTarget("185.100.200.45:30120");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.target?.port, 30120);
    assert.strictEqual(res.target?.targetType, "ip_port");
  });

  await test("Rejects invalid port (port 0 or 70000)", async () => {
    const res = await parseAndValidateTarget("185.100.200.45:70000");
    assert.strictEqual(res.valid, false);
  });

  await test("Parses Cfx.re join URL correctly", async () => {
    const res = await parseAndValidateTarget("cfx.re/join/k8x9pq");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.target?.targetType, "server_id");
    assert.strictEqual(res.target?.serverCode, "k8x9pq");
  });

  await test("Parses standalone 6-char Cfx code", async () => {
    const res = await parseAndValidateTarget("ab34ef");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.target?.serverCode, "ab34ef");
  });

  console.log("\n[3] Evidence & Confidence Engine Tests:");

  await test("Calculates 0% confidence for empty evidences", () => {
    const conf = ConfidenceEngine.calculate([]);
    assert.strictEqual(conf.score, 0);
    assert.strictEqual(conf.status, "not_detected");
  });

  await test("Calculates 100% (Confirmed) for authorized agent evidence", () => {
    const ee = new EvidenceEngine();
    const ev = ee.addEvidence({
      sourceType: "authorized_agent",
      sourceReference: "fxmanifest",
      evidenceType: "manifest_signature",
      description: "Direct server export",
    });
    const conf = ConfidenceEngine.calculate([ev]);
    assert.strictEqual(conf.score, 100);
    assert.strictEqual(conf.status, "confirmed");
  });

  await test("Calculates Strong Evidence (85%) for direct resource entry", () => {
    const ee = new EvidenceEngine();
    const ev = ee.addEvidence({
      sourceType: "info_json",
      sourceReference: "resources[]",
      evidenceType: "resource_entry",
      description: "Direct entry in resources array",
    });
    const conf = ConfidenceEngine.calculate([ev]);
    assert.strictEqual(conf.score, 85);
    assert.strictEqual(conf.status, "strong_evidence");
  });

  await test("Calculates Weak Evidence (45%) for tag-only match", () => {
    const ee = new EvidenceEngine();
    const ev = ee.addEvidence({
      sourceType: "dynamic_json",
      sourceReference: "hostname",
      evidenceType: "meta_tag",
      description: "Tag occurrence in server title",
    });
    const conf = ConfidenceEngine.calculate([ev]);
    assert.strictEqual(conf.score, 45);
    assert.strictEqual(conf.status, "weak_evidence");
  });

  console.log("\n[4] Framework & Resource Detector Tests:");

  await test("Detects QBCore framework from resources and vars", () => {
    const ee = new EvidenceEngine();
    const mockMeta: FetchedMetadata = {
      online: true,
      hostname: "My Roleplay",
      playersCount: 10,
      maxPlayers: 64,
      serverVars: { qb_version: "2.1.0" },
      resources: ["qb-core", "ox_lib", "ox_inventory"],
      sourceEndpoints: {},
      observedAt: new Date().toISOString(),
    };

    const detectedFw = FrameworkDetector.detect(mockMeta, ee);
    const qb = detectedFw.find((f) => f.slug === "qb-core");
    assert.ok(qb, "QBCore should be detected");
    assert.strictEqual(qb?.verificationStatus, "confirmed");
  });

  await test("Detects ESX Legacy from es_extended", () => {
    const ee = new EvidenceEngine();
    const mockMeta: FetchedMetadata = {
      online: true,
      hostname: "ESX Czech City",
      playersCount: 5,
      maxPlayers: 32,
      serverVars: { esx_version: "Legacy 1.9" },
      resources: ["es_extended", "esx_menu_default"],
      sourceEndpoints: {},
      observedAt: new Date().toISOString(),
    };

    const detectedFw = FrameworkDetector.detect(mockMeta, ee);
    const esx = detectedFw.find((f) => f.slug === "esx-legacy");
    assert.ok(esx, "ESX should be detected");
  });

  await test("Detects catalog resources: ox_inventory and ox_target", () => {
    const ee = new EvidenceEngine();
    const mockMeta: FetchedMetadata = {
      online: true,
      hostname: "Test Server",
      playersCount: 0,
      maxPlayers: 32,
      serverVars: {},
      resources: ["ox_inventory", "ox_target", "random_script"],
      sourceEndpoints: {},
      observedAt: new Date().toISOString(),
    };

    const detectedRes = ResourceDetector.detect(mockMeta, ee);
    assert.ok(detectedRes.some((r) => r.slug === "ox_inventory"));
    assert.ok(detectedRes.some((r) => r.slug === "ox_target"));
    assert.strictEqual(detectedRes.some((r) => r.slug === "random_script"), false);
  });

  console.log("\n--------------------------------------------------");
  console.log(`Tests finished: ${passed} passed, ${failed} failed`);
  console.log("--------------------------------------------------");

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
