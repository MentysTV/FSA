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
    aliases: ["waveshield"],
    description: "Ochrana serverových eventů a tokenový anticheat systém.",
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

    return results;
  }
}
