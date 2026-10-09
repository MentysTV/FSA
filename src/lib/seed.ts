import { prisma } from "./prisma";
import { hashPassword } from "./auth";
import { KNOWN_CATALOG_RESOURCES } from "./scanner/resource-detector";

export async function runDatabaseSeed() {
  console.log("Seeding FSD database...");

  // 1. Users
  const adminPassword = await hashPassword("AdminFSD2026!");
  const demoPassword = await hashPassword("DemoUser2026!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@fsd.local" },
    update: {},
    create: {
      email: "admin@fsd.local",
      username: "FSD_Admin",
      passwordHash: adminPassword,
      role: "admin",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=FSDAdmin",
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@fsd.local" },
    update: {},
    create: {
      email: "demo@fsd.local",
      username: "FiveMDev_Czech",
      passwordHash: demoPassword,
      role: "user",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=DemoUser",
    },
  });

  // 2. Resource Catalog
  for (const item of KNOWN_CATALOG_RESOURCES) {
    await prisma.resourceCatalog.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        category: item.category,
        description: item.description,
      },
      create: {
        slug: item.slug,
        name: item.name,
        category: item.category,
        description: item.description,
        author: item.slug.startsWith("ox_") ? "Overextended" : item.slug.startsWith("qb-") ? "QBCore Team" : "FiveM Community",
        officialUrl: item.slug.startsWith("ox_") ? "https://overextended.dev" : "https://github.com",
        documentationUrl: item.slug.startsWith("ox_") ? "https://overextended.dev/docs" : "https://docs.qbcore.org",
        supportedFrameworks: item.slug.startsWith("qb-") ? "QBCore, Qbox" : "ESX, QBCore, Qbox, Standalone",
        verifiedAt: new Date(),
      },
    });
  }

  // 3. Realistic Demo Server Target and Report (Clearly marked as DEMO)
  const demoTarget = await prisma.serverTarget.upsert({
    where: { normalizedIdentifier: "demo.czech-rp-official.net:30120" },
    update: {
      displayName: "[DEMO] Czech Roleplay Community Server",
      lastOnlineStatus: true,
      lastPlayers: 114,
      lastMaxPlayers: 128,
    },
    create: {
      normalizedIdentifier: "demo.czech-rp-official.net:30120",
      displayName: "[DEMO] Czech Roleplay Community Server",
      targetType: "ip_port",
      ip: "185.100.200.45",
      port: 30120,
      lastOnlineStatus: true,
      lastPlayers: 114,
      lastMaxPlayers: 128,
      ownerId: demoUser.id,
    },
  });

  // Check if a demo scan already exists
  const existingDemoScan = await prisma.scan.findFirst({
    where: { targetId: demoTarget.id },
  });

  if (!existingDemoScan) {
    const demoScan = await prisma.scan.create({
      data: {
        id: "demo-scan-report-01",
        targetId: demoTarget.id,
        userId: demoUser.id,
        status: "completed",
        scanMode: "public",
        scannerVersion: "1.0.0",
        startedAt: new Date(Date.now() - 3600000),
        finishedAt: new Date(Date.now() - 3594000),
      },
    });

    // Framework Result
    const fwRes = await prisma.scanResult.create({
      data: {
        scanId: demoScan.id,
        resultType: "framework",
        name: "QBCore Framework",
        version: "v2.1.0",
        category: "core",
        verificationStatus: "confirmed",
        confidenceScore: 95,
        summary: "Detekován framework QBCore (Potvrzeno). Potvrzeno vícenásobnými přímými důkazy.",
      },
    });

    await prisma.evidence.createMany({
      data: [
        {
          scanId: demoScan.id,
          resultId: fwRes.id,
          sourceType: "info_json",
          sourceReference: "resources[]",
          evidenceType: "resource_entry",
          description: "Nalezen základní core resource: 'qb-core'",
          rawValue: "qb-core",
          verificationStatus: "confirmed",
        },
        {
          scanId: demoScan.id,
          resultId: fwRes.id,
          sourceType: "info_json",
          sourceReference: "vars.qb_version",
          evidenceType: "server_var",
          description: "Serverová proměnná QBCore: qb_version = 2.1.0",
          rawValue: "qb_version: 2.1.0",
          verificationStatus: "confirmed",
        },
      ],
    });

    // Inventory Result
    const invRes = await prisma.scanResult.create({
      data: {
        scanId: demoScan.id,
        resultType: "resource",
        name: "ox_inventory",
        category: "inventory",
        verificationStatus: "strong_evidence",
        confidenceScore: 85,
        summary: "Slot-based inventory systém od Overextended. (Silné důkazy).",
      },
    });

    await prisma.evidence.create({
      data: {
        scanId: demoScan.id,
        resultId: invRes.id,
        sourceType: "info_json",
        sourceReference: "resources[]",
        evidenceType: "resource_entry",
        description: "V seznamu veřejných resources zjištěn záznam: 'ox_inventory'",
        rawValue: "ox_inventory",
        verificationStatus: "confirmed",
      },
    });

    // Target Interaction Result
    const targetRes = await prisma.scanResult.create({
      data: {
        scanId: demoScan.id,
        resultType: "resource",
        name: "ox_target",
        category: "interaction",
        verificationStatus: "strong_evidence",
        confidenceScore: 85,
        summary: "Vysoce optimalizovaný raycast targeting systém pro interakce se světem.",
      },
    });

    await prisma.evidence.create({
      data: {
        scanId: demoScan.id,
        resultId: targetRes.id,
        sourceType: "info_json",
        sourceReference: "resources[]",
        evidenceType: "resource_entry",
        description: "V seznamu veřejných resources zjištěn záznam: 'ox_target'",
        rawValue: "ox_target",
        verificationStatus: "confirmed",
      },
    });

    // Police MDT
    const mdtRes = await prisma.scanResult.create({
      data: {
        scanId: demoScan.id,
        resultType: "game_system",
        name: "Project Sloth MDT",
        category: "police_ems",
        verificationStatus: "strong_evidence",
        confidenceScore: 80,
        summary: "Policejní Mobile Data Terminal (databáze občanů, incidentů a zatykačů).",
      },
    });

    await prisma.evidence.create({
      data: {
        scanId: demoScan.id,
        resultId: mdtRes.id,
        sourceType: "info_json",
        sourceReference: "resources[]",
        evidenceType: "resource_entry",
        description: "V seznamu veřejných resources zjištěn záznam: 'ps-mdt'",
        rawValue: "ps-mdt",
        verificationStatus: "confirmed",
      },
    });

    // Phone Result
    const phoneRes = await prisma.scanResult.create({
      data: {
        scanId: demoScan.id,
        resultType: "game_system",
        name: "LB Phone",
        category: "phone",
        verificationStatus: "strong_evidence",
        confidenceScore: 80,
        summary: "Vyspělý herní smartphone (iOS/Android) s kamerou, videohovory a aplikacemi.",
      },
    });

    await prisma.evidence.create({
      data: {
        scanId: demoScan.id,
        resultId: phoneRes.id,
        sourceType: "info_json",
        sourceReference: "resources[]",
        evidenceType: "resource_entry",
        description: "V seznamu veřejných resources zjištěn záznam: 'lb-phone'",
        rawValue: "lb-phone",
        verificationStatus: "confirmed",
      },
    });

    // Voice Result
    const voiceRes = await prisma.scanResult.create({
      data: {
        scanId: demoScan.id,
        resultType: "resource",
        name: "pma-voice",
        category: "hud",
        verificationStatus: "strong_evidence",
        confidenceScore: 85,
        summary: "Vysoce výkonný 3D prostorový hlasový chat s rádiovými kanály.",
      },
    });

    await prisma.evidence.create({
      data: {
        scanId: demoScan.id,
        resultId: voiceRes.id,
        sourceType: "info_json",
        sourceReference: "resources[]",
        evidenceType: "resource_entry",
        description: "V seznamu veřejných resources zjištěn záznam: 'pma-voice'",
        rawValue: "pma-voice",
        verificationStatus: "confirmed",
      },
    });

    // Prepare demo summary JSON
    const demoSummary = {
      scanId: demoScan.id,
      targetId: demoTarget.id,
      normalizedIdentifier: demoTarget.normalizedIdentifier,
      displayName: demoTarget.displayName,
      status: "completed",
      scanMode: "public",
      online: true,
      playersCount: 114,
      maxPlayers: 128,
      startedAt: demoScan.startedAt.toISOString(),
      finishedAt: demoScan.finishedAt?.toISOString(),
      durationMs: 6000,
      frameworkCount: 1,
      resourceCount: 4,
      systemCount: 2,
      evidenceCount: 7,
      averageConfidence: 85,
      detectedFrameworks: [
        {
          slug: "qb-core",
          name: "QBCore Framework",
          category: "core",
          resultType: "framework",
          version: "v2.1.0",
          verificationStatus: "confirmed",
          confidenceScore: 95,
          summary: "Detekován framework QBCore (Potvrzeno). Potvrzeno vícenásobnými přímými důkazy.",
          evidences: [
            {
              id: "ev_demo_1",
              sourceType: "info_json",
              sourceReference: "resources[]",
              evidenceType: "resource_entry",
              description: "Nalezen základní core resource: 'qb-core'",
              rawValue: "qb-core",
              verificationStatus: "confirmed",
              observedAt: new Date().toISOString(),
            },
          ],
        },
      ],
      detectedResources: [
        {
          slug: "ox_inventory",
          name: "ox_inventory",
          category: "inventory",
          resultType: "resource",
          verificationStatus: "strong_evidence",
          confidenceScore: 85,
          summary: "Slot-based inventory systém od Overextended.",
          evidences: [
            {
              id: "ev_demo_2",
              sourceType: "info_json",
              sourceReference: "resources[]",
              evidenceType: "resource_entry",
              description: "V seznamu veřejných resources zjištěn záznam: 'ox_inventory'",
              rawValue: "ox_inventory",
              verificationStatus: "confirmed",
              observedAt: new Date().toISOString(),
            },
          ],
        },
        {
          slug: "ox_target",
          name: "ox_target",
          category: "interaction",
          resultType: "resource",
          verificationStatus: "strong_evidence",
          confidenceScore: 85,
          summary: "Vysoce optimalizovaný raycast targeting systém pro interakce se světem.",
          evidences: [
            {
              id: "ev_demo_3",
              sourceType: "info_json",
              sourceReference: "resources[]",
              evidenceType: "resource_entry",
              description: "V seznamu veřejných resources zjištěn záznam: 'ox_target'",
              rawValue: "ox_target",
              verificationStatus: "confirmed",
              observedAt: new Date().toISOString(),
            },
          ],
        },
        {
          slug: "pma-voice",
          name: "pma-voice",
          category: "hud",
          resultType: "resource",
          verificationStatus: "strong_evidence",
          confidenceScore: 85,
          summary: "Vysoce výkonný 3D prostorový hlasový chat s rádiovými kanály.",
          evidences: [
            {
              id: "ev_demo_4",
              sourceType: "info_json",
              sourceReference: "resources[]",
              evidenceType: "resource_entry",
              description: "V seznamu veřejných resources zjištěn záznam: 'pma-voice'",
              rawValue: "pma-voice",
              verificationStatus: "confirmed",
              observedAt: new Date().toISOString(),
            },
          ],
        },
      ],
      detectedSystems: [
        {
          slug: "ps-mdt",
          name: "Project Sloth MDT",
          category: "police_ems",
          resultType: "game_system",
          verificationStatus: "strong_evidence",
          confidenceScore: 80,
          summary: "Policejní Mobile Data Terminal (databáze občanů, incidentů a zatykačů).",
          evidences: [
            {
              id: "ev_demo_5",
              sourceType: "info_json",
              sourceReference: "resources[]",
              evidenceType: "resource_entry",
              description: "V seznamu veřejných resources zjištěn záznam: 'ps-mdt'",
              rawValue: "ps-mdt",
              verificationStatus: "confirmed",
              observedAt: new Date().toISOString(),
            },
          ],
        },
        {
          slug: "lb-phone",
          name: "LB Phone",
          category: "phone",
          resultType: "game_system",
          verificationStatus: "strong_evidence",
          confidenceScore: 80,
          summary: "Vyspělý herní smartphone (iOS/Android) s kamerou, videohovory a aplikacemi.",
          evidences: [
            {
              id: "ev_demo_6",
              sourceType: "info_json",
              sourceReference: "resources[]",
              evidenceType: "resource_entry",
              description: "V seznamu veřejných resources zjištěn záznam: 'lb-phone'",
              rawValue: "lb-phone",
              verificationStatus: "confirmed",
              observedAt: new Date().toISOString(),
            },
          ],
        },
      ],
      unavailableSources: ["players.json (přímý seznam hráčů skryt)"],
      limitationsNotes: [
        "Toto je demonstrační analýza určená k ukázce struktury reportu (DEMO data).",
        "Všechny výsledky jsou podloženy konkrétními záznamy v seznamech metadat.",
      ],
    };

    await prisma.scan.update({
      where: { id: demoScan.id },
      data: {
        summaryJson: JSON.stringify(demoSummary),
        rawData: JSON.stringify({
          hostname: demoTarget.displayName,
          clients: 114,
          sv_maxclients: 128,
          resources: ["qb-core", "ox_lib", "ox_inventory", "ox_target", "ps-mdt", "lb-phone", "pma-voice"],
          vars: { qb_version: "2.1.0", tags: "czech, roleplay, qbcore" },
        }),
      },
    });
  }

  console.log("Database seeded successfully!");
}
