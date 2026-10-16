import { EvidenceEngine } from "./evidence-engine";
import { ConfidenceEngine } from "./confidence-engine";
import { FetchedMetadata, TechnologyDetection } from "./types";

export interface KnownResourceDefinition {
  slug: string;
  name: string;
  category: string;
  resultType: "resource" | "game_system";
  aliases: string[];
  description: string;
}

export const KNOWN_CATALOG_RESOURCES: KnownResourceDefinition[] = [
  // Inventories
  {
    slug: "ox_inventory",
    name: "ox_inventory",
    category: "inventory",
    resultType: "resource",
    aliases: ["ox_inventory"],
    description: "Slot-based inventory systém od Overextended.",
  },
  {
    slug: "qb-inventory",
    name: "qb-inventory",
    category: "inventory",
    resultType: "resource",
    aliases: ["qb-inventory", "lj-inventory"],
    description: "Standardní inventář QBCore ekosystému s gridovým rozhraním.",
  },
  {
    slug: "qs-inventory",
    name: "Quasar Inventory",
    category: "inventory",
    resultType: "resource",
    aliases: ["qs-inventory", "qs_inventory"],
    description: "Komerční inventářový balíček od Quasar Store.",
  },
  {
    slug: "core_inventory",
    name: "Core Inventory",
    category: "inventory",
    resultType: "resource",
    aliases: ["core_inventory"],
    description: "Modulární inventář s drag & drop od Core Scripts.",
  },

  // Interactions / Target
  {
    slug: "ox_target",
    name: "ox_target",
    category: "interaction",
    resultType: "resource",
    aliases: ["ox_target"],
    description: "Vysoce optimalizovaný raycast targeting systém pro interakce se světem.",
  },
  {
    slug: "qb-target",
    name: "qb-target",
    category: "interaction",
    resultType: "resource",
    aliases: ["qb-target"],
    description: "Eye-targeting systém vyvinutý pro QBCore.",
  },

  // Police & Emergency
  {
    slug: "ps-mdt",
    name: "Project Sloth MDT",
    category: "police_ems",
    resultType: "game_system",
    aliases: ["ps-mdt"],
    description: "Policejní Mobile Data Terminal (databáze občanů, incidentů a zatykačů).",
  },
  {
    slug: "cd_policeMDT",
    name: "Codesign Police MDT",
    category: "police_ems",
    resultType: "game_system",
    aliases: ["cd_policemdt"],
    description: "Komplexní policejní systém s živou mapou a evidencí důkazů od Codesign.",
  },
  {
    slug: "qb-policejob",
    name: "qb-policejob",
    category: "police_ems",
    resultType: "game_system",
    aliases: ["qb-policejob"],
    description: "Základní policejní služba, pouta, radar a arzenál pro QBCore.",
  },
  {
    slug: "wasabi_ambulance",
    name: "Wasabi Ambulance",
    category: "police_ems",
    resultType: "game_system",
    aliases: ["wasabi_ambulance"],
    description: "Moderní záchranářský a ošetřovatelský systém od Wasabi.",
  },

  // Vehicles & Fuel
  {
    slug: "qb-garages",
    name: "qb-garages",
    category: "vehicles",
    resultType: "game_system",
    aliases: ["qb-garages", "jg-advancedgarages"],
    description: "Veřejné i soukromé garáže a odtahová parkoviště.",
  },
  {
    slug: "cd_garage",
    name: "Codesign Garage",
    category: "vehicles",
    resultType: "game_system",
    aliases: ["cd_garage"],
    description: "Pokročilý garážový systém s vlastním parkováním a vizuálním UI.",
  },
  {
    slug: "ox_fuel",
    name: "ox_fuel",
    category: "vehicles",
    resultType: "resource",
    aliases: ["ox_fuel"],
    description: "Realistický palivový systém pro čerpací stanice a kanystry od Overextended.",
  },
  {
    slug: "LegacyFuel",
    name: "LegacyFuel",
    category: "vehicles",
    resultType: "resource",
    aliases: ["legacyfuel"],
    description: "Klasický lehký palivový skript pro FiveM.",
  },

  // Economy & Banking
  {
    slug: "qb-banking",
    name: "qb-banking",
    category: "economy",
    resultType: "game_system",
    aliases: ["qb-banking"],
    description: "Bankovní aplikace, bankomaty a firemní účty.",
  },
  {
    slug: "okokBanking",
    name: "OkOk Banking",
    category: "economy",
    resultType: "game_system",
    aliases: ["okokbanking"],
    description: "Moderní bankovní UI systém s transakční historií a kartami od okokScripts.",
  },
  {
    slug: "okokBilling",
    name: "OkOk Billing",
    category: "economy",
    resultType: "game_system",
    aliases: ["okokbilling"],
    description: "Fakturační systém pro občany a podniky.",
  },

  // Communication & Voice
  {
    slug: "lb-phone",
    name: "LB Phone",
    category: "phone",
    resultType: "game_system",
    aliases: ["lb-phone"],
    description: "Vyspělý herní smartphone (iOS/Android) s kamerou, videohovory a aplikacemi.",
  },
  {
    slug: "qs-smartphone",
    name: "Quasar Smartphone Pro",
    category: "phone",
    resultType: "game_system",
    aliases: ["qs-smartphone", "qs-smartphone-pro"],
    description: "Interaktivní telefon s garážemi, krypto burzou a sociálními sítěmi.",
  },
  {
    slug: "qb-phone",
    name: "qb-phone",
    category: "phone",
    resultType: "game_system",
    aliases: ["qb-phone"],
    description: "Původní smartphone systém pro QBCore servery.",
  },
  {
    slug: "pma-voice",
    name: "pma-voice",
    category: "hud",
    resultType: "resource",
    aliases: ["pma-voice"],
    description: "Vysoce výkonný 3D prostorový hlasový chat s rádiovými kanály.",
  },

  // Housing
  {
    slug: "ps-housing",
    name: "Project Sloth Housing",
    category: "housing",
    resultType: "game_system",
    aliases: ["ps-housing"],
    description: "Realitní systém s volným nábytkem a dynamickými interiéry.",
  },

  // Clothing
  {
    slug: "illenium-appearance",
    name: "illenium-appearance",
    category: "clothing",
    resultType: "resource",
    aliases: ["illenium-appearance"],
    description: "Kompletní úprava postavy, šatník, tetování a ped menu.",
  },

  // HUD
  {
    slug: "ps-hud",
    name: "Project Sloth HUD",
    category: "hud",
    resultType: "game_system",
    aliases: ["ps-hud"],
    description: "Herní ukazatel zdraví, brnění, hladu, žízně, tachometru a kompasu.",
  },

  // Anticheat
  {
    slug: "txAdmin",
    name: "txAdmin Server Manager",
    category: "anticheat",
    resultType: "resource",
    aliases: ["monitor", "txadmin"],
    description: "Oficiální administrační rozhraní a dohledový systém pro FXServer.",
  },
  {
    slug: "FiveGuard",
    name: "FiveGuard Anticheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["fg-anticheat", "fiveguard"],
    description: "Komerční anticheat s detekcí injektovaných skriptů a manipulací se zbraněmi.",
  },
  {
    slug: "WaveShield",
    name: "WaveShield",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["waveshield", "wave-shield", "wave_shield", "waveshield-ac"],
    description: "Ochrana serverových eventů a tokenový anticheat systém.",
  },
  {
    slug: "PhoenixAC",
    name: "Phoenix AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["phoenix", "phoenix-ac", "phoenix_ac", "phoenixanticheat", "phx-ac"],
    description: "Pokročilá detekce Lua injekce, noclip, godmode a manipulace s entitami.",
  },
  {
    slug: "BadgerAC",
    name: "Badger AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["badger", "badger-ac", "badger_anticheat", "badgeranticheat", "badger-anticheat"],
    description: "Populární komunitní ochrana proti zakázaným zbraním, vozidlům a teleportaci.",
  },
  {
    slug: "ReaperAC",
    name: "Reaper AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["reaper", "reaper-ac", "reaper_ac", "reaperac"],
    description: "Heuristická ochrana proti dumperům kódu a nezabezpečeným executorům.",
  },
  {
    slug: "FireAC",
    name: "FireAC / FireShield",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["fireac", "fire-ac", "fire_ac", "fireshield", "fire_shield"],
    description: "Ochrana proti rate-limitingu eventů, projektilům a exploiterům zbraní.",
  },
  {
    slug: "MatrixAC",
    name: "Matrix AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["matrix", "matrix-ac", "matrix_ac", "matrixac"],
    description: "Rychlý event trigger blocker a blacklist zakázaných modelů a propů.",
  },
  {
    slug: "ChocoHax",
    name: "ChocoHax Security",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["chocohax", "chocohax-ac", "choco-hax", "chocohax_ac"],
    description: "Tradiční klientská ochrana a blokátor cheat menu a injektorů.",
  },
  {
    slug: "EchoAC",
    name: "Echo AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["echo", "echo-ac", "echoac", "echo_ac"],
    description: "Cloudem asistovaný audit screenshotů a ochrana integrity serverových eventů.",
  },
  {
    slug: "NexusAC",
    name: "Nexus AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["nexus", "nexus-ac", "nexusac", "nexus_anticheat"],
    description: "Sanitizér serverových eventů a restrikce neautorizovaných spawnů.",
  },
  {
    slug: "FidelisAC",
    name: "Fidelis AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["fidelis", "fidelis-ac", "fidelis_ac", "fidelisac"],
    description: "Tokenizované eventy a ochrana proti dumpování klientských skriptů.",
  },
  {
    slug: "TgiannAC",
    name: "Tgiann AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["tgiann-anticheat", "tgiann_ac", "tgiann-ac"],
    description: "Monitorování injekce skriptů a detekce nepovolených menu.",
  },
  {
    slug: "KS-AC",
    name: "KS AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["ks-anticheat", "ks_ac", "ks-ac"],
    description: "Komplexní serverová a klientská ochrana FiveM exploitů.",
  },
  {
    slug: "LunarAC",
    name: "Lunar AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["lunar-ac", "lunar_ac", "lunarac"],
    description: "Detekce neoprávněných akcí a ochrana proti noclipům a godmode.",
  },
  {
    slug: "Castiglione",
    name: "Castiglione Modder Guard",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["castiglione", "ac-guard", "server-guard", "modder-guard"],
    description: "Obranný skript blokující útoky a přetížení serveru od modderů.",
  },
  {
    slug: "GenericAntiCheat",
    name: "Interní / Samostatný AntiCheat",
    category: "anticheat",
    resultType: "game_system",
    aliases: ["anticheat", "anti-cheat", "ac-system", "anti-godmode", "antinoclip", "anti-dump", "anti-executor", "antidump", "antiexecutor"],
    description: "Vlastní nebo komunitní bezpečnostní skript na ochranu serveru.",
  },
];

export class ResourceDetector {
  /**
   * Scans metadata against verifiable known resources in the catalog.
   */
  static detect(metadata: FetchedMetadata, evidenceEngine: EvidenceEngine): TechnologyDetection[] {
    const results: TechnologyDetection[] = [];
    const serverResources = metadata.resources.map((r) => r.toLowerCase());

    for (const item of KNOWN_CATALOG_RESOURCES) {
      const evidences = [];

      for (const alias of item.aliases) {
        const found = serverResources.find((sr) => sr === alias.toLowerCase());
        if (found) {
          evidences.push(
            evidenceEngine.addEvidence({
              sourceType: "info_json",
              sourceReference: "resources[]",
              evidenceType: "resource_entry",
              description: `V seznamu veřejných resources zjištěn záznam: '${found}'`,
              rawValue: found,
            })
          );
        }
      }

      if (evidences.length > 0) {
        const conf = ConfidenceEngine.calculate(evidences);
        results.push({
          slug: item.slug,
          name: item.name,
          category: item.category,
          resultType: item.resultType,
          verificationStatus: conf.status,
          confidenceScore: conf.score,
          summary: `${item.description} (${conf.statusLabelCs}).`,
          evidences,
        });
      }
    }

    // Also run heuristic detection for anticheats not strictly in catalog aliases
    const detectedSlugs = new Set(results.map((r) => r.slug.toLowerCase()));
    const anticheatRegex = /(?:anti[-_]?cheat|[-_]ac$|^ac[-_]|waveshield|fiveguard|fireshield|badger|reaper|eulen|chocohax|matrix|tgiann[-_]ac|antidump|anti[-_]executor)/i;

    for (const res of metadata.resources) {
      const lower = res.toLowerCase();
      // Skip known non-anticheat false positives
      if (lower.startsWith("action") || lower.startsWith("activity") || lower === "ac_radio") continue;

      if (anticheatRegex.test(lower) && !detectedSlugs.has(lower)) {
        const ev = evidenceEngine.addEvidence({
          sourceType: "info_json",
          sourceReference: "resources[]",
          evidenceType: "resource_entry",
          description: `Vzor anticheatu detekován ve jménu resource: '${res}'`,
          rawValue: res,
        });
        const conf = ConfidenceEngine.calculate([ev]);
        results.push({
          slug: `ac-${lower.replace(/[^a-z0-9]/g, "-")}`,
          name: res,
          category: "anticheat",
          resultType: "game_system",
          verificationStatus: conf.status,
          confidenceScore: 85,
          summary: `Heuristicky detekovaný bezpečnostní/anticheat resource: '${res}'.`,
          evidences: [ev],
        });
        detectedSlugs.add(lower);
      }
    }

    return results;
  }

  /**
   * Specifically extracts all anticheat detections from the overall detection results.
   */
  static detectAnticheats(allDetections: TechnologyDetection[]): TechnologyDetection[] {
    return allDetections.filter((d) => d.category === "anticheat");
  }

  /**
   * Extracts Discord invite link and community server code from metadata.
   */
  static extractDiscord(metadata: FetchedMetadata): {
    found: boolean;
    inviteUrl?: string;
    inviteCode?: string;
    source?: string;
  } {
    const vars = metadata.serverVars || {};

    // 1. Direct variable search
    const discordKeys = [
      "Discord",
      "discord",
      "Discord Server",
      "connect_discord",
      "sv_discord",
      "discord_link",
      "server_discord",
    ];

    for (const k of discordKeys) {
      const val = vars[k];
      if (val && typeof val === "string") {
        const clean = val.trim();
        const extracted = this.parseDiscordCodeOrUrl(clean);
        if (extracted) {
          return {
            found: true,
            inviteUrl: extracted.url,
            inviteCode: extracted.code,
            source: `vars.${k}`,
          };
        }
      }
    }

    // 2. Scan all string vars for discord link
    for (const [key, val] of Object.entries(vars)) {
      if (typeof val === "string" && val.toLowerCase().includes("discord")) {
        const extracted = this.parseDiscordCodeOrUrl(val);
        if (extracted) {
          return {
            found: true,
            inviteUrl: extracted.url,
            inviteCode: extracted.code,
            source: `vars.${key}`,
          };
        }
      }
    }

    // 3. Scan hostname
    if (metadata.hostname && metadata.hostname.toLowerCase().includes("discord")) {
      const extracted = this.parseDiscordCodeOrUrl(metadata.hostname);
      if (extracted) {
        return {
          found: true,
          inviteUrl: extracted.url,
          inviteCode: extracted.code,
          source: "hostname",
        };
      }
    }

    return { found: false };
  }

  private static parseDiscordCodeOrUrl(text: string): { url: string; code: string } | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite|discord\.com\/invite)\/([a-zA-Z0-9\-_]+)/i;
    const match = text.match(regex);
    if (match && match[1]) {
      const code = match[1];
      return {
        url: `https://discord.gg/${code}`,
        code,
      };
    }

    // Fallback: discord.gg/code without protocol
    const shortRegex = /discord\.gg\/([a-zA-Z0-9\-_]+)/i;
    const shortMatch = text.match(shortRegex);
    if (shortMatch && shortMatch[1]) {
      return {
        url: `https://discord.gg/${shortMatch[1]}`,
        code: shortMatch[1],
      };
    }

    return null;
  }

  /**
   * Categorizes 100% of server resources so nothing is hidden.
   * Maps every resource into anticheat, MLO/maps, vehicles, clothing, framework, inventory, phone, jobs, gameplay, standalone.
   */
  static categorizeAllResources(resources: string[]): Array<{
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
  }> {
    return resources.map((rawName) => {
      const name = rawName.trim();
      const lower = name.toLowerCase();

      // 1. Anticheats
      if (
        /(?:anti[-_]?cheat|[-_]ac$|^ac[-_]|waveshield|fiveguard|fireshield|badger|reaper|eulen|chocohax|matrix|tgiann[-_]ac|antidump|anti[-_]executor|castiglione)/i.test(
          lower
        ) &&
        !lower.startsWith("action") &&
        !lower.startsWith("activity") &&
        lower !== "ac_radio"
      ) {
        return {
          name,
          category: "anticheat",
          categoryLabel: "Anticheat & Zabezpečení",
          type: "anticheat",
          description: "Bezpečnostní skript / ochrana proti cheatům",
          isAnticheat: true,
        };
      }

      // 2. MLO & Maps & Interiors
      if (
        /(?:^cfx-gabz|^gabz|mlo|map|interior|ymap|prompt|unclejust|k4mb1|brofx|noop|patoche|shell|building|house|hospital|station|court|mechanic|biker|pillbox|motel|plaza|dealership|bank|garage_interior)/i.test(
          lower
        ) &&
        !lower.includes("mapmanager")
      ) {
        return {
          name,
          category: "mlo_maps",
          categoryLabel: "MLO & Mapy",
          type: "mlo",
          description: "Herní interiér, budova, YMAP nebo mapa světa",
          isMlo: true,
        };
      }

      // 3. Vehicles & Sounds
      if (
        /(?:veh|car|sound|handling|siren|livery|wheel|rims|moto|bike|boat|heli|audi|bmw|mercedes|porsche|ferrari|lamborghini|toyota|nissan|2vd_|onx-evp|fdtiller|hakuchou|vstaniert|vscout|dalamole|vehicle)/i.test(
          lower
        )
      ) {
        return {
          name,
          category: "vehicles",
          categoryLabel: "Vozidla & Zvuky",
          type: "vehicle",
          description: "Balíček vozidel, engine zvuky nebo handling",
        };
      }

      // 4. Clothing & EUP
      if (
        /(?:eup|cloth|hair|tattoo|ped|appearance|skin|mp_m_|mp_f_|wardrobe|illenium)/i.test(
          lower
        )
      ) {
        return {
          name,
          category: "clothing",
          categoryLabel: "Oblečení & EUP",
          type: "clothing",
          description: "EUP uniformy, vlasy, tetování nebo modely postav",
        };
      }

      // 5. Framework & Core
      if (
        /(?:es_extended|qb-core|qbx_core|ox_core|vrp|ox_lib|yarn|webpack|screenshot-basic|spawnmanager|sessionmanager|hardcap|rconlog)/i.test(
          lower
        )
      ) {
        return {
          name,
          category: "framework",
          categoryLabel: "Jádro & Framework",
          type: "framework",
          description: "Základní knihovna, framework nebo systémová komponenta",
        };
      }

      // 6. Inventory
      if (/(?:inventory|inv|ox_inventory|qb-inventory|qs-inventory|core_inventory|chezzainventory)/i.test(lower)) {
        return {
          name,
          category: "inventory",
          categoryLabel: "Inventář",
          type: "inventory",
          description: "Inventářový a předmětový systém",
        };
      }

      // 7. Phone & Communication
      if (/(?:phone|smartphone|lb-phone|qs-smartphone|qb-phone|yseries|pma-voice|saltychat|mumble-voip|radio)/i.test(lower)) {
        return {
          name,
          category: "phone",
          categoryLabel: "Telefon & Hlas",
          type: "phone",
          description: "Herní telefon, vysílačka nebo prostorový hlas",
        };
      }

      // 8. Jobs & Factions & MDT
      if (
        /(?:police|ambulance|ems|hospital|mechanic|taxi|mdt|dispatch|wasabi|job|gang|lawyer|judge)/i.test(
          lower
        )
      ) {
        return {
          name,
          category: "jobs",
          categoryLabel: "Práce & Frakce",
          type: "job",
          description: "Systém pro policii, EMS, mechaniky nebo frakce",
        };
      }

      // 9. Gameplay & Scripts
      if (
        /(?:banking|bank|fuel|hud|garage|robbery|heist|drugs|weed|coke|meth|casino|housing|apartments|shops|doorlock|notify|target|menu|animation)/i.test(
          lower
        )
      ) {
        return {
          name,
          category: "gameplay",
          categoryLabel: "Herní Skripty",
          type: "gameplay",
          description: "Ekonomika, vykrádačky, UI, garáže nebo hratelnost",
        };
      }

      // 10. Default Standalone FXServer resources
      if (/(?:chat|mapmanager|baseevents|playernames|runcode)/i.test(lower)) {
        return {
          name,
          category: "standalone",
          categoryLabel: "Výchozí Cfx",
          type: "standalone",
          description: "Základní komponenta FiveM / FXServer",
        };
      }

      // 11. Other custom resources
      return {
        name,
        category: "other",
        categoryLabel: "Ostatní Skripty",
        type: "other",
        description: "Uživatelský serverový skript nebo rozšíření",
      };
    });
  }
}

