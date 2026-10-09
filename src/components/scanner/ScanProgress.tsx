"use client";

import React from "react";
import { CheckCircle2, Loader2, Circle, AlertCircle, ShieldAlert } from "lucide-react";
import { ScanStatus } from "@/lib/scanner/types";

interface Step {
  id: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    id: "validating",
    title: "Validace cíle & SSRF ochrana",
    description: "Kontrola IP, portu a blokování privátních rozsahů",
  },
  {
    id: "connecting",
    title: "Kontrola síťové dostupnosti",
    description: "Ověření odezvy a navázání spojení s portem 30120",
  },
  {
    id: "fetching_metadata",
    title: "Dotazování FiveM JSON endpointů",
    description: "Čtení info.json, dynamic.json, players.json nebo Cfx.re API",
  },
  {
    id: "analyzing",
    title: "Vyhodnocování důkazů & Frameworků",
    description: "Mapování záznamů proti katalogu a výpočet míry jistoty",
  },
  {
    id: "generating_report",
    title: "Generování reportu",
    description: "Sestavení výsledkového přehledu a uložení do databáze",
  },
];

interface Props {
  currentStatus: ScanStatus;
  errorMessage?: string;
  onCancel?: () => void;
}

export function ScanProgress({ currentStatus, errorMessage, onCancel }: Props) {
  const getStepStatus = (stepIndex: number) => {
    const statusOrder: ScanStatus[] = [
      "validating",
      "connecting",
      "fetching_metadata",
      "analyzing",
      "generating_report",
      "completed",
    ];

    const currentIdx = statusOrder.indexOf(currentStatus);

    if (currentStatus === "failed") {
      // If failed, mark previous as done and current as error
      return stepIndex === 1 || stepIndex === 2 ? "error" : stepIndex < 2 ? "completed" : "pending";
    }

    if (currentStatus === "completed" || currentStatus === "partial") {
      return "completed";
    }

    if (currentIdx === -1) {
      return stepIndex === 0 ? "active" : "pending";
    }

    if (stepIndex < currentIdx) return "completed";
    if (stepIndex === currentIdx) return "active";
    return "pending";
  };

  return (
    <div className="w-full bg-[#131722] border border-[#252B3A] rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-5 border-b border-[#252B3A] mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] animate-ping"></span>
            Průběh analýzy serveru
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Backend provádí sérii bezpečných dotazů a vyhodnocuje doložené důkazy
          </p>
        </div>

        {onCancel && currentStatus !== "completed" && currentStatus !== "failed" && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg border border-[#252B3A] text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1a202e] transition-colors"
          >
            Zrušit
          </button>
        )}
      </div>

      <div className="space-y-4">
        {STEPS.map((step, idx) => {
          const status = getStepStatus(idx);

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all ${
                status === "active"
                  ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/40"
                  : status === "completed"
                  ? "bg-[#0E1118]/60 border-[#252B3A]"
                  : status === "error"
                  ? "bg-rose-500/10 border-rose-500/30"
                  : "bg-transparent border-transparent opacity-40"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : status === "active" ? (
                  <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin" />
                ) : status === "error" ? (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-semibold ${
                      status === "active"
                        ? "text-white"
                        : status === "completed"
                        ? "text-slate-200"
                        : status === "error"
                        ? "text-rose-300"
                        : "text-slate-500"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    {status === "active"
                      ? "Zpracovává se"
                      : status === "completed"
                      ? "Hotovo"
                      : status === "error"
                      ? "Chyba"
                      : "Čeká"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {errorMessage && (
        <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-rose-300">
            <strong className="block font-semibold text-rose-200 mb-1">Analýza nemohla být dokončena</strong>
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
}
