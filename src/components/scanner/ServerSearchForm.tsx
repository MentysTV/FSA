"use client";

import React, { useState } from "react";
import { Search, Shield, Globe, Terminal, AlertCircle, ArrowRight } from "lucide-react";
import { ScanMode } from "@/lib/scanner/types";

interface Props {
  onScanStart: (target: string, mode: ScanMode, notes?: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export function ServerSearchForm({ onScanStart, isLoading, initialValue = "" }: Props) {
  const [target, setTarget] = useState(initialValue);
  const [mode, setMode] = useState<ScanMode>("public");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const val = target.trim();
    if (!val) {
      setError("Zadejte IP adresu s portem (např. 185.100.200.45:30120) nebo kód Cfx.re.");
      return;
    }

    onScanStart(val, mode, notes);
  };

  const handleQuickDemo = (demoTarget: string) => {
    setTarget(demoTarget);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Target input box */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] rounded-2xl blur opacity-30 group-focus-within:opacity-80 transition duration-300"></div>
        <div className="relative flex flex-col sm:flex-row items-stretch bg-[#131722] border border-[#252B3A] rounded-2xl p-2 gap-2 shadow-2xl">
          <div className="flex-1 flex items-center px-3 gap-3">
            <Terminal className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
            <input
              type="text"
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                if (error) setError("");
              }}
              placeholder="IP:port (např. 185.100.200.45:30120) nebo kód serveru (k8x9pq)"
              disabled={isLoading}
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !target.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-semibold text-sm shadow-lg shadow-[#8B5CF6]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Analyzuji...</span>
              </>
            ) : (
              <>
                <span>Analyzovat server</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-400 text-xs px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mode selection & options */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 text-xs">
        {/* Modes */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Režim:</span>
          <button
            type="button"
            onClick={() => setMode("public")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all ${
              mode === "public"
                ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-white"
                : "bg-[#131722] border-[#252B3A] text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Veřejný sken (Public)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("authorized")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all ${
              mode === "authorized"
                ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-white"
                : "bg-[#131722] border-[#252B3A] text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Autorizovaný (Vlastník)</span>
          </button>
        </div>

        {/* Quick demo pills */}
        <div className="flex items-center gap-2 text-slate-400">
          <span>Příklady:</span>
          <button
            type="button"
            onClick={() => handleQuickDemo("demo.czech-rp-official.net:30120")}
            className="font-mono text-[11px] text-[#38BDF8] hover:underline"
          >
            demo.czech-rp...
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => handleQuickDemo("185.100.200.45:30120")}
            className="font-mono text-[11px] text-slate-300 hover:underline"
          >
            185.100.200.45:30120
          </button>
        </div>
      </div>
    </form>
  );
}
