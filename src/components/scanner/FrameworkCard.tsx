"use client";

import React, { useState } from "react";
import { Cpu, ChevronDown, ChevronUp, CheckCircle, ExternalLink, Shield } from "lucide-react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { TechnologyDetection } from "@/lib/scanner/types";

interface Props {
  framework: TechnologyDetection;
}

export function FrameworkCard({ framework }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#131722] border border-[#252B3A] rounded-xl p-5 hover:border-[#384358] transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white text-base">{framework.name}</h4>
              {framework.version && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1e2436] text-purple-300 border border-purple-500/20">
                  {framework.version}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{framework.summary}</p>
          </div>
        </div>

        <ConfidenceBadge status={framework.verificationStatus} score={framework.confidenceScore} />
      </div>

      {framework.evidences && framework.evidences.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#252B3A]">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Zobrazit doložené důkazy ({framework.evidences.length})
            </span>
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {open && (
            <div className="mt-3 space-y-2">
              {framework.evidences.map((ev, idx) => (
                <div
                  key={idx}
                  className="bg-[#0E1118] p-3 rounded-lg border border-[#252B3A] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                    <span className="text-[#38BDF8]">{ev.sourceType}</span>
                    <span className="text-slate-500">{ev.sourceReference}</span>
                  </div>
                  <div className="text-slate-200 font-medium">{ev.description}</div>
                  {ev.rawValue && (
                    <div className="bg-[#08090D] px-2 py-1 rounded font-mono text-[11px] text-purple-300 overflow-x-auto">
                      {ev.rawValue}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
