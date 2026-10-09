import React from "react";
import { ShieldCheck, Database, Calendar, Hash } from "lucide-react";
import { EvidenceRecord } from "@/lib/scanner/types";

interface Props {
  evidences: EvidenceRecord[];
}

export function EvidencePanel({ evidences }: Props) {
  if (!evidences || evidences.length === 0) {
    return (
      <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 text-center text-slate-400 text-xs">
        V této analýze nebyly zaznamenány žádné přímé důkazy.
      </div>
    );
  }

  return (
    <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-[#252B3A]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Evidence Engine – Protokol doložených důkazů ({evidences.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Každé tvrzení v reportu je mapováno na konkrétní nezávisle ověřitelný záznam.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {evidences.map((ev, index) => (
          <div
            key={index}
            className="bg-[#0E1118] border border-[#252B3A] rounded-xl p-4 text-xs space-y-2 hover:border-[#384358] transition-colors"
          >
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                {ev.sourceType}
              </span>
              <span className="text-slate-500 truncate max-w-[180px]">{ev.sourceReference}</span>
            </div>

            <p className="text-slate-200 font-medium leading-relaxed">{ev.description}</p>

            {ev.rawValue && (
              <div className="p-2 rounded bg-[#08090D] border border-[#252B3A] font-mono text-[11px] text-[#38BDF8] break-all">
                {ev.rawValue}
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-[#252B3A]/40">
              <span className="flex items-center gap-1 font-mono">
                <Hash className="w-3 h-3" />
                {ev.evidenceType}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(ev.observedAt).toLocaleTimeString("cs-CZ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
