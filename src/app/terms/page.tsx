import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na hlavní stránku
        </Link>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white">Podmínky použití služby (Terms of Service)</h1>
          <p className="text-xs text-slate-400">Platnost od: 1. ledna 2026 • Verze 1.0</p>
        </div>

        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Povaha a účel služby</h2>
            <p>
              Aplikace <strong>FSD PRO</strong> (FiveM Script Detector) je nezávislý analytický nástroj
              určený pro technickou analýzu veřejně dostupných informací a metadat herních serverů na
              platformě FiveM (FXServer).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Vyloučení odpovědnosti a vztah k třetím stranám</h2>
            <p>
              FSD PRO není oficiálním produktem společnosti Rockstar Games, Take-Two Interactive ani
              Cfx.re. Služba nevyužívá žádné chráněné zdrojové kódy třetích stran a funguje výhradně na
              bázi otevřených síťových protokolů HTTP GET.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Povolené a zakázané použití</h2>
            <p>
              Uživatelé se zavazují, že nebudou skener využívat k útočným operacím, zahlcování síťové
              infrastruktury (DoS) ani k pokusům o obcházení bezpečnosti. Veškeré požadavky jsou
              monitorovány a chráněny striktní SSRF ochranou a rychlostními limity (Rate Limiting).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Přesnost a doložitelnost výsledků</h2>
            <p>
              FSD PRO striktně rozlišuje ověřená data od indicií. Reporty vyjadřují stav zachycený v čase
              provedení analýzy. Změny na cílovém serveru po dokončení skenu se v existujícím reportu
              projeví až při další opakované analýze.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
