import React from "react";
import Link from "next/link";
import {
  Radar,
  ShieldCheck,
  Server,
  Zap,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  HelpCircle,
  Lock,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConfidenceBadge } from "@/components/scanner/ConfidenceBadge";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Glow & Grid Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#8B5CF6]/15 to-[#38BDF8]/10 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#252B3A_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-xs font-medium text-purple-300">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
              FSD PRO – FiveM Script Detector & Architecture Inspector
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Zjisti, jaké technologie{" "}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#a855f7] to-[#38BDF8] bg-clip-text text-transparent">
                používají FiveM servery
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
              Analyzuj dostupná veřejná metadata, identifikuj frameworky a prozkoumej technologické
              stopy FiveM serverů na jednom místě s ověřitelnými důkazy.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/scanner"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-semibold text-sm shadow-xl shadow-[#8B5CF6]/25 transition-all"
              >
                <Radar className="w-4 h-4" />
                <span>Spustit skenování</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="#how-it-works"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#131722] hover:bg-[#1a202e] border border-[#252B3A] text-slate-300 font-semibold text-sm transition-all"
              >
                <span>Jak to funguje</span>
              </Link>
            </div>
          </div>

          {/* Interactive Live Demo Preview in Hero */}
          <div className="mt-16 max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-500"></div>

            <div className="relative rounded-2xl bg-[#0E1118] border border-[#252B3A] p-4 sm:p-6 shadow-2xl overflow-hidden">
              {/* Demo Badge Ribbon */}
              <div className="flex items-center justify-between pb-4 border-b border-[#252B3A] mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <span className="font-mono text-xs text-slate-400 pl-2">
                    fsd-inspector://report/demo.czech-rp-official.net:30120
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold tracking-wider uppercase">
                  DEMO UKÁZKA VÝSLEDKŮ
                </span>
              </div>

              {/* Server Hero Banner in Demo */}
              <div className="bg-[#131722] rounded-xl p-4 border border-[#252B3A] mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <h3 className="font-bold text-white text-base">
                        [DEMO] Czech Roleplay Community Server
                      </h3>
                    </div>
                    <p className="font-mono text-xs text-slate-400 mt-0.5">
                      185.100.200.45:30120 • 114 / 128 Hráčů online
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <ConfidenceBadge status="confirmed" score={95} />
                    <Link
                      href="/reports/demo-scan-report-01"
                      className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-purple-300 text-xs font-medium hover:bg-[#8B5CF6]/30 transition-colors"
                    >
                      Otevřít celý report
                    </Link>
                  </div>
                </div>
              </div>

              {/* Grid of Detected Items */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Framework */}
                <div className="bg-[#131722]/80 border border-[#252B3A] rounded-xl p-3 space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Core Framework</span>
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>QBCore Framework</span>
                    <span className="text-emerald-400 text-xs">95%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Doloženo: qb-core v resources + var qb_version</p>
                </div>

                {/* Inventory */}
                <div className="bg-[#131722]/80 border border-[#252B3A] rounded-xl p-3 space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Inventářový systém</span>
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>ox_inventory</span>
                    <span className="text-purple-400 text-xs">85%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Doloženo: ox_inventory v seznamu spuštěných resources</p>
                </div>

                {/* Police MDT */}
                <div className="bg-[#131722]/80 border border-[#252B3A] rounded-xl p-3 space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Policejní MDT</span>
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>Project Sloth MDT</span>
                    <span className="text-purple-400 text-xs">80%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Doloženo: ps-mdt v systémovém seznamu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 border-t border-[#252B3A] bg-[#0E1118]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Jak skener funguje & jak ověřuje data
            </h2>
            <p className="text-sm text-[#94A3B8]">
              FSD PRO nevytváří smyšlené odhady. Každý krok se opírá o standardizované,
              veřejně přístupné protokoly platformy FiveM (FXServer).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Validace & SSRF</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Vstupní IP adresa nebo Cfx kód projde přísnou kontrolou. Blokujeme privátní rozsahy,
                lokální rozhraní a pokusy o DNS rebinding.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Dotazování endpointů</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Dotazujeme standardní JSON endpointy serveru (info.json, dynamic.json, players.json)
                nebo oficiální Cfx.re Directory API.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Evidence Engine</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Každá nalezená stopa (název scriptu, serverová proměnná, herní tag) je uložena
                jako nezávislý důkaz s přesným časem a zdrojem.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Confidence Scoring</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Deterministický algoritmus přiřadí skóre 0–100 % s přehlednými štítky: Potvrzeno,
                Silné důkazy, Slabé důkazy nebo Nezjištěno.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Supported */}
      <section className="py-20 border-t border-[#252B3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Podporované kategorie technologií
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Náš katalog obsahuje desítky ověřených FiveM balíčků a herních systémů.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Core Frameworky", desc: "ESX, QBCore, Qbox, vRP" },
              { title: "Inventáře", desc: "ox_inventory, qb-inventory, Quasar" },
              { title: "Interakce & Target", desc: "ox_target, qb-target" },
              { title: "Policejní MDT", desc: "ps-mdt, Codesign MDT, Police Job" },
              { title: "Vozidla & Garáže", desc: "qb-garages, ox_fuel, cd_garage" },
              { title: "Bankovnictví", desc: "qb-banking, okokBanking, Billing" },
              { title: "Smartphony", desc: "lb-phone, qs-smartphone, qb-phone" },
              { title: "Anticheat & Sys", desc: "txAdmin, FiveGuard, WaveShield" },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="bg-[#131722] border border-[#252B3A] rounded-xl p-4 hover:border-[#8B5CF6]/50 transition-colors"
              >
                <h4 className="font-bold text-white text-sm mb-1">{cat.title}</h4>
                <p className="text-xs text-slate-400">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations & Security Disclaimers */}
      <section id="limitations" className="py-16 border-t border-[#252B3A] bg-[#0E1118]/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-bold text-white text-base">
                Bezpečnost, limity a transparentnost analýzy
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              FSD PRO nikdy neprovádí útočné operace, skenování portů mimo specifikovaný cíl ani
              obcházení ochranných mechanismů. Aplikace se dotazuje výhradně na veřejně
              dostupné JSON rozhraní (info.json, dynamic.json), které FiveM server sám vystavuje.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-start gap-2 bg-[#0E1118] p-3 rounded-lg border border-[#252B3A]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Žádné falešné výsledky:</strong> Pokud server seznam resources skryje,
                  označíme jej jako nedostupný, namísto hádání.
                </span>
              </div>
              <div className="flex items-start gap-2 bg-[#0E1118] p-3 rounded-lg border border-[#252B3A]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Autorizovaný režim pro majitele:</strong> Majitelé mohou použít náš lehký
                  serverový resource pro garantovaný a podepsaný export.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-[#252B3A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Často kladené otázky</h2>
            <p className="text-xs text-slate-400">Vše, co potřebujete vědět o FSD PRO</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="bg-[#131722] border border-[#252B3A] rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-white">Může skener poškodit skenovaný FiveM server?</h4>
              <p className="text-slate-400 leading-relaxed">
                Absolutně ne. Skenování posílá standardní HTTP GET požadavky s pevným časovým
                limitem na stejné veřejné endpointy, které využívá herní klient FiveM při
                zobrazování serveru v seznamu serverů.
              </p>
            </div>

            <div className="bg-[#131722] border border-[#252B3A] rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-white">Proč některé servery nemají zobrazeny žádné resources?</h4>
              <p className="text-slate-400 leading-relaxed">
                Některé servery používají konfiguraci nebo proxy brány, které endpoint info.json
                skrývají nebo vracejí prázdný seznam. V takovém případě FSD PRO poctivě nahlásí,
                že zdroj je nedostupný, a nevymýšlí falešné záznamy.
              </p>
            </div>

            <div className="bg-[#131722] border border-[#252B3A] rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-white">Jak funguje Authorized Scan pro majitele?</h4>
              <p className="text-slate-400 leading-relaxed">
                Majitel serveru si stáhne oficiální FiveM resource (fsd_agent), vygeneruje si v
                nastavení API token a vloží jej do config.lua. Agent potom bezpečně odesílá
                výhradně schválené názvy spuštěných resources. Žádný kód ani hesla se nikdy
                neodesílají.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 border-t border-[#252B3A] bg-gradient-to-b from-[#08090D] to-[#0E1118]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Připraveni analyzovat svůj FiveM server?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Zadejte IP adresu nebo kód serveru a během několika sekund získejte podrobný technologický report.
          </p>
          <div>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7c3aed] text-white font-semibold text-sm shadow-xl shadow-[#8B5CF6]/30 hover:scale-[1.02] transition-all"
            >
              <Radar className="w-4 h-4" />
              <span>Otevřít Skener</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
