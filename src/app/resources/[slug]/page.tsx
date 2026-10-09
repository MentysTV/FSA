import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Package,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  Layers,
  Code,
  Globe,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function ResourceDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const resource = await prisma.resourceCatalog.findUnique({
    where: { slug },
    include: {
      rules: true,
    },
  });

  if (!resource) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět do katalogu
        </Link>

        {/* Card Header */}
        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#252B3A]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-black text-white">{resource.name}</h1>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#0E1118] text-purple-300 border border-purple-500/20">
                    {resource.category}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Autor / Vydavatel: <strong className="text-slate-200">{resource.author || "FiveM Komunita"}</strong>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2">
              {resource.officialUrl && (
                <a
                  href={resource.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1118] border border-[#252B3A] text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
                  Oficiální web
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}
              {resource.documentationUrl && (
                <a
                  href={resource.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-xs text-purple-300 hover:text-white transition-colors"
                >
                  <Code className="w-3.5 h-3.5 text-purple-400" />
                  Dokumentace
                  <ExternalLink className="w-3 h-3 text-purple-400" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Popis skriptu</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{resource.description}</p>
          </div>

          {resource.supportedFrameworks && (
            <div className="bg-[#0E1118] p-4 rounded-xl border border-[#252B3A] space-y-1 text-xs">
              <span className="text-slate-400 font-medium">Podporované frameworky:</span>
              <p className="text-slate-200 font-semibold">{resource.supportedFrameworks}</p>
            </div>
          )}
        </div>

        {/* Detection Rules & Methods */}
        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Způsoby a pravidla identifikace v FSD PRO
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            FSD PRO používá následující ověřitelné metody k detekci tohoto skriptu na serverech:
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="bg-[#0E1118] p-4 rounded-xl border border-[#252B3A] space-y-1">
              <strong className="text-purple-300 font-mono text-[11px] block">
                Metoda 1: Přímý záznam v poli `resources[]` (info.json)
              </strong>
              <p className="text-slate-300">
                Pokud server veřejně vystavuje seznam spuštěných resources a obsahuje název{" "}
                <code className="text-[#38BDF8] bg-[#08090D] px-1 py-0.5 rounded font-mono">
                  {resource.slug}
                </code>
                , je položka zaznamenána se skóre 80–85 % (Silné důkazy).
              </p>
            </div>

            <div className="bg-[#0E1118] p-4 rounded-xl border border-[#252B3A] space-y-1">
              <strong className="text-purple-300 font-mono text-[11px] block">
                Metoda 2: Autorizovaný export serveru (Authorized Agent)
              </strong>
              <p className="text-slate-300">
                Pokud má server nainstalovaný resource <code className="text-[#38BDF8]">fsd_agent</code>,
                je resource potvrzen se 100% jistotou přímo z interního API FXServeru.
              </p>
            </div>
          </div>
        </div>

        {/* Detection Limitations */}
        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            Omezení detekce
          </div>
          <p className="text-slate-400 leading-relaxed">
            Přejmenování složky resource na serveru (např. z <code>{resource.slug}</code> na vlastní název)
            může způsobit, že veřejný skener bez autorizace vlastníka tento skript nerozpozná.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
