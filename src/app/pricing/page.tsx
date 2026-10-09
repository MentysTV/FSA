import React from "react";
import Link from "next/link";
import { Check, Radar, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-xs font-medium text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Tarify a Možnosti
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Jednoduché a Transparentní Tarify</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Základní veřejné skenování je a vždy zůstane zcela zdarma pro celou FiveM komunitu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Community Free */}
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-lg">Community Free</h3>
                <p className="text-xs text-slate-400 mt-1">Pro běžné hráče a zvědavé vývojáře</p>
              </div>

              <div className="text-3xl font-black text-white">
                0 Kč <span className="text-xs text-slate-400 font-normal">/ navždy</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Veřejné skenování IP:port
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Detekce hlavních frameworků
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Přístup k veřejnému katalogu
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Export reportu do JSON
                </li>
              </ul>
            </div>

            <Link
              href="/scanner"
              className="w-full py-3 rounded-xl border border-[#252B3A] text-slate-200 hover:text-white hover:bg-[#1a202e] font-semibold text-xs text-center transition-colors"
            >
              Začít skenovat zdarma
            </Link>
          </div>

          {/* Server Owner Pro */}
          <div className="bg-[#131722] border-2 border-[#8B5CF6] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#8B5CF6] text-white text-[10px] font-extrabold uppercase tracking-wider">
              DOPORUČENO
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-lg">Server Owner PRO</h3>
                <p className="text-xs text-slate-400 mt-1">Pro majitele a administrátory serverů</p>
              </div>

              <div className="text-3xl font-black text-white">
                199 Kč <span className="text-xs text-slate-400 font-normal">/ měsíc</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Vše z Community Free
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Autorizovaný FiveM Agent (fsd_agent)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> 100% potvrzená míra jistoty
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Historie změn a monitoring verzí
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Export do PDF s ověřovacím pečetěm
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7c3aed] text-white font-semibold text-xs text-center shadow-lg shadow-[#8B5CF6]/30 transition-all hover:opacity-90"
            >
              Vyzkoušet na 14 dní zdarma
            </Link>
          </div>

          {/* Network Enterprise */}
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-lg">Studio / Network</h3>
                <p className="text-xs text-slate-400 mt-1">Pro herní sítě a vývojářská studia</p>
              </div>

              <div className="text-3xl font-black text-white">
                499 Kč <span className="text-xs text-slate-400 font-normal">/ měsíc</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Neomezený počet serverů
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Vlastní detekční pravidla v administraci
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Webhook notifikace o změnách
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Prioritní API limity & podpora
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3 rounded-xl border border-[#252B3A] text-slate-200 hover:text-white hover:bg-[#1a202e] font-semibold text-xs text-center transition-colors"
            >
              Kontaktovat podporu
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
