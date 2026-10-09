import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-black text-white">Zásady ochrany osobních údajů (Privacy Policy)</h1>
          <p className="text-xs text-slate-400">Soulad s GDPR • Verze 1.0</p>
        </div>

        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Jaké údaje shromažďujeme</h2>
            <p>
              Při registraci ukládáme pouze váš <strong>e-mail</strong>, zvolené{" "}
              <strong>uživatelské jméno</strong> a kryptograficky solený hash hesla (bcrypt).
              Hesla nikdy neukládáme v otevřené podobě.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Údaje o hráčích na herních serverech</h2>
            <p>
              Při dotazování endpointu <code>players.json</code> ukládáme a zobrazujeme pouze
              celkový počet připojených hráčů. <strong>Osobní identifikátory hráčů</strong> (např.
              Steam ID, Discord ID, FiveM licence nebo IP adresy hráčů) se ve veřejných reportech
              nezobrazují a nejsou agregovány.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Právo na výmaz dat</h2>
            <p>
              Uživatel má plné právo kdykoliv smazat své vlastní analytické reporty přímo v sekci{" "}
              <Link href="/history" className="text-[#8B5CF6] underline">
                Historie
              </Link>
              . V případě žádosti o kompletní výmaz uživatelského účtu se obraťte na administrátora
              nebo využijte správu účtu.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Autorizovaný FiveM Agent</h2>
            <p>
              Skript <code>fsd_agent</code> odesílá výhradně schválené názvy spuštěných resources.
              Žádné zdrojové kódy, hesla k databázím, SSH klíče ani citlivé konfigurace se nikdy
              nečtou a neodesílají.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
