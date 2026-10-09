"use client";

import React from "react";
import Link from "next/link";
import { Radar, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#252B3A] bg-[#0E1118] text-[#94A3B8] text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center">
                <Radar className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <span className="font-bold text-white text-base">FSD PRO</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Odhal technologie, které pohánějí FiveM servery. Nezávislý analytický nástroj
              zaměřený na ověřitelná data a důkazy.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SSRF Guard Active & Secure
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Aplikace</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/scanner" className="hover:text-white transition-colors">
                  Serverový skener
                </Link>
              </li>
              <li>
                <Link href="/servers" className="hover:text-white transition-colors">
                  Analyzované servery
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Porovnávač serverů
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Katalog známých scriptů
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Docs */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Dokumentace</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  Jak skener funguje
                </Link>
              </li>
              <li>
                <Link href="/#limitations" className="hover:text-white transition-colors">
                  Metodika jistoty & limity
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Autorizovaný FiveM Agent
                </Link>
              </li>
              <li>
                <Link href="/api/health" className="hover:text-white transition-colors font-mono">
                  Systémový stav (Health)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Právní informace</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Podmínky použití služby
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Zásady ochrany osobních údajů
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-slate-500 leading-normal">
                FSD PRO není oficiálním produktem Cfx.re, FiveM ani Rockstar Games. Aplikace
                pouze analyzuje veřejně přístupná metadata.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#252B3A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>© 2026 FSD PRO (FiveM Script Detector). Všechna práva vyhrazena.</div>
          <div className="flex items-center gap-1 text-slate-500">
            Navrženo pro GTA V Roleplay komunitu a vývojáře
          </div>
        </div>
      </div>
    </footer>
  );
}
