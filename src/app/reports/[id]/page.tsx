import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Server,
  Users,
  Clock,
  RotateCw,
  Package,
  Cpu,
  Layers,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  ArrowLeft,
  Calendar,
  Activity,
  Terminal,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScanStatusBadge } from "@/components/scanner/ScanStatusBadge";
import { ConfidenceBadge } from "@/components/scanner/ConfidenceBadge";
import { FrameworkCard } from "@/components/scanner/FrameworkCard";
import { ResourceTable } from "@/components/scanner/ResourceTable";
import { EvidencePanel } from "@/components/scanner/EvidencePanel";
import { ExportMenu } from "@/components/scanner/ExportMenu";
import { ServerLiveStatusHeader } from "@/components/scanner/ServerLiveStatusHeader";
import { AnticheatAlertBanner } from "@/components/scanner/AnticheatAlertBanner";
import { AllResourcesExplorer } from "@/components/scanner/AllResourcesExplorer";
import { ResourceDetector } from "@/lib/scanner/resource-detector";
import { TechnologyDetection, EvidenceRecord, CategorizedResource, DiscordInfo } from "@/lib/scanner/types";


export const dynamic = "force-dynamic";

export default async function ReportDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const scan = await prisma.scan.findUnique({
    where: { id },
    include: {
      target: true,
      user: { select: { id: true, username: true } },
      results: {
        include: {
          evidences: true,
        },
      },
      evidences: true,
    },
  });

  if (!scan) {
    notFound();
  }

  let summary: any = null;
  if (scan.summaryJson) {
    try {
      summary = JSON.parse(scan.summaryJson);
    } catch {}
  }

  let rawData: any = null;
  if (scan.rawData) {
    try {
      rawData = JSON.parse(scan.rawData);
    } catch {}
  }

  // Parse structured detections
  const frameworks: TechnologyDetection[] = scan.results
    .filter((r) => r.resultType === "framework")
    .map((r) => ({
      slug: r.name.toLowerCase().replace(/\s+/g, "-"),
      name: r.name,
      category: r.category || "core",
      resultType: "framework",
      version: r.version || undefined,
      verificationStatus: r.verificationStatus as any,
      confidenceScore: r.confidenceScore,
      summary: r.summary || "",
      evidences: r.evidences as any,
    }));

  const resources: TechnologyDetection[] = scan.results
    .filter((r) => r.resultType === "resource")
    .map((r) => ({
      slug: r.name.toLowerCase().replace(/\s+/g, "-"),
      name: r.name,
      category: r.category || "resource",
      resultType: "resource",
      version: r.version || undefined,
      verificationStatus: r.verificationStatus as any,
      confidenceScore: r.confidenceScore,
      summary: r.summary || "",
      evidences: r.evidences as any,
    }));

  const systems: TechnologyDetection[] = scan.results
    .filter((r) => r.resultType === "game_system")
    .map((r) => ({
      slug: r.name.toLowerCase().replace(/\s+/g, "-"),
      name: r.name,
      category: r.category || "game_system",
      resultType: "game_system",
      version: r.version || undefined,
      verificationStatus: r.verificationStatus as any,
      confidenceScore: r.confidenceScore,
      summary: r.summary || "",
      evidences: r.evidences as any,
    }));

  const allEvidences: EvidenceRecord[] = scan.evidences as any;
  const isDemo = scan.id.startsWith("demo-") || scan.target.normalizedIdentifier.includes("demo.");

  // Anticheats resolution
  const anticheats: TechnologyDetection[] =
    summary?.detectedAnticheats && summary.detectedAnticheats.length > 0
      ? summary.detectedAnticheats
      : ResourceDetector.detectAnticheats([...resources, ...systems]);

  // Discord resolution
  const discordInfo: DiscordInfo =
    summary?.discordInfo ||
    (rawData ? ResourceDetector.extractDiscord(rawData) : { found: false });

  // 100% of server resources categorized
  const allCategorizedResources: CategorizedResource[] =
    summary?.allCategorizedResources && summary.allCategorizedResources.length > 0
      ? summary.allCategorizedResources
      : rawData?.resources
      ? ResourceDetector.categorizeAllResources(rawData.resources)
      : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/scanner"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zpět na skener
          </Link>

          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                DEMO DATA REPORT
              </span>
            )}
            <ExportMenu report={summary || { ...scan, targetId: scan.targetId }} rawScan={scan} />
            <Link
              href={`/scanner?target=${encodeURIComponent(scan.target.normalizedIdentifier)}`}
              className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs font-semibold shadow-md shadow-[#8B5CF6]/20 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Opakovat sken
            </Link>
          </div>
        </div>

        {/* 1. Live Server Status Card (Online, Players/Slots, Discord, Connect) */}
        <ServerLiveStatusHeader
          displayName={scan.target.displayName || scan.target.normalizedIdentifier}
          normalizedIdentifier={scan.target.normalizedIdentifier}
          online={summary?.online ?? scan.target.lastOnlineStatus}
          playersCount={summary?.playersCount ?? scan.target.lastPlayers}
          maxPlayers={summary?.maxPlayers ?? scan.target.lastMaxPlayers}
          gameType={rawData?.gameType}
          mapName={rawData?.mapName}
          discordInfo={discordInfo}
          serverVars={rawData?.serverVars}
          bannerDetail={rawData?.bannerDetail}
          icon={rawData?.serverVars?.iconVersion || rawData?.serverVars?.icon}
        />

        {/* 2. Anticheat Alert & Security Panel */}
        <AnticheatAlertBanner anticheats={anticheats} />

        {/* 3. Section: Frameworks */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-lg font-bold text-white">Detekované Frameworky jádra</h2>
          </div>

          {frameworks.length === 0 ? (
            <div className="bg-[#131722] border border-[#252B3A] rounded-xl p-6 text-center text-xs text-slate-400">
              Ve veřejných metadatech nebyl nalezen žádný zřejmý důkaz o standardním frameworku
              (ESX/QBCore/Qbox/vRP). Server může být postaven na čistém Standalone kódu.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {frameworks.map((fw) => (
                <FrameworkCard key={fw.slug} framework={fw} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Complete Server Resources Explorer (100% of all scripts, MLOs, cars) */}
        {allCategorizedResources.length > 0 && (
          <section>
            <AllResourcesExplorer
              resources={allCategorizedResources}
              serverName={scan.target.displayName || scan.target.normalizedIdentifier}
            />
          </section>
        )}

        {/* 5. Section: Verified Catalog Matches */}
        <section className="space-y-6">
          <ResourceTable
            resources={resources}
            title="Katalogově ověřené Resources"
            subtitle="Položky s nezávisle doloženými důkazy a kalkulovaným skóre spolehlivosti."
          />

          {systems.length > 0 && (
            <ResourceTable
              resources={systems}
              title="Herní subsystémy & Doplňky"
              subtitle="Policejní terminály, smartphony, garáže a ekonomické balíčky."
            />
          )}
        </section>

            title="Detekované Resources & Skripty"
            subtitle="Položky přímo doložené v seznamu spuštěných resources nebo konfiguraci serveru."
          />

          {systems.length > 0 && (
            <ResourceTable
              resources={systems}
              title="Herní subsystémy & Integrace"
              subtitle="Policejní terminály, smartphony, garáže a anticheaty."
            />
          )}
        </section>

        {/* Section: Evidence Log */}
        <section>
          <EvidencePanel evidences={allEvidences} />
        </section>

        {/* Section: Limitations & Unavailable Endpoints */}
        <section className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Omezení analýzy & Nedostupné zdroje</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="bg-[#0E1118] p-4 rounded-xl border border-[#252B3A] space-y-2">
              <strong className="block text-white font-semibold">Metodická omezení:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Veřejný skener analyzuje pouze veřejně poskytnutá HTTP metadata.</li>
                <li>Přejmenované nebo privátní resources nelze veřejně doložit bez souhlasu majitele.</li>
                <li>Absence nálezu není důkazem, že daný skript na serveru neexistuje.</li>
              </ul>
            </div>

            <div className="bg-[#0E1118] p-4 rounded-xl border border-[#252B3A] space-y-2">
              <strong className="block text-white font-semibold">Stav dotazovaných endpointů:</strong>
              {summary?.unavailableSources && summary.unavailableSources.length > 0 ? (
                <ul className="space-y-1">
                  {summary.unavailableSources.map((s: string, idx: number) => (
                    <li key={idx} className="text-amber-400/90 font-mono text-[11px]">
                      • {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-emerald-400 font-mono text-[11px]">
                  ✓ Všechny podporované veřejné endpointy odpověděly v pořádku.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Raw Metadata Accordion */}
        {rawData && (
          <details className="bg-[#131722] border border-[#252B3A] rounded-xl p-4 text-xs group">
            <summary className="font-semibold text-slate-400 hover:text-white cursor-pointer select-none">
              Zobrazit surová JSON metadata serveru
            </summary>
            <div className="mt-3 p-3 rounded-lg bg-[#08090D] font-mono text-[11px] text-purple-300 overflow-x-auto max-h-96">
              <pre>{JSON.stringify(rawData, null, 2)}</pre>
            </div>
          </details>
        )}
      </main>

      <Footer />
    </div>
  );
}
