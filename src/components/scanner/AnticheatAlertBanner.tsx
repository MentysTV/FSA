"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, Lock, Eye, Terminal } from "lucide-react";
import { TechnologyDetection } from "@/lib/scanner/types";

interface Props {
  anticheats: TechnologyDetection[];
}

export function AnticheatAlertBanner({ anticheats }: Props) {
  const hasAnticheat = anticheats.length > 0;

  if (!hasAnticheat) {
    return (
      <div className="bg-[#131722] border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400 shadow-lg shadow-amber-500/10">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Nenalezeny známé signatury
                </span>
                <span className="text-xs text-slate-400">Bezpečnostní audit manifestu</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Žádný známý anticheat nebyl ve veřejném manifestu detekován
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                V seznamu spuštěných resources nebyly identifikovány standardní komerční anticheaty (FiveGuard, Phoenix, WaveShield atd.). Server může používat privátní ochranu integrovanou v jádře, vlastní server-side validace eventů, nebo má názvy skriptů zamaskované.
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-[#0E1118] border border-[#252B3A] text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
            Detekováno: <span className="text-amber-400 font-bold">0 systémů</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#131722] border border-red-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      
      <div className="relative z-10 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#252B3A]">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center flex-shrink-0 text-red-400 shadow-lg shadow-red-500/20 animate-pulse">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/25 text-red-300 border border-red-500/40">
                  🛡️ DETEKOVÁNA OCHRANA
                </span>
                <span className="text-xs text-slate-400">Aktivní bezpečnostní systémy na serveru</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                Na serveru {anticheats.length === 1 ? "byl detekován 1 anticheat" : `bylo detekováno ${anticheats.length} anticheatů`}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0E1118] border border-red-500/30 text-xs font-mono text-slate-300">
            <Lock className="w-4 h-4 text-red-400" />
            <span>Úroveň zabezpečení: <strong className="text-red-400">VYSOKÁ</strong></span>
          </div>
        </div>

        {/* Anticheat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {anticheats.map((ac) => (
            <div
              key={ac.slug}
              className="bg-[#0E1118]/80 border border-red-500/20 hover:border-red-500/40 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-red-500/5 group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  <h4 className="font-bold text-white text-sm group-hover:text-red-300 transition-colors">
                    {ac.name}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20">
                  {ac.confidenceScore}% Jistota
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                {ac.summary}
              </p>

              {ac.evidences && ac.evidences.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#252B3A] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Terminal className="w-3 h-3 text-red-400" />
                    Resource: <code className="text-red-300 font-semibold">{ac.evidences[0].rawValue || ac.name}</code>
                  </span>
                  <span className="text-emerald-400 text-[10px]">Potvrzeno</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
