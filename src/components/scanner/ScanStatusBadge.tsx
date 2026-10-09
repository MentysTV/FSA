import React from "react";
import { Check, AlertCircle, X, Clock, Loader2 } from "lucide-react";
import { ScanStatus } from "@/lib/scanner/types";

interface Props {
  status: ScanStatus;
}

export function ScanStatusBadge({ status }: Props) {
  let label: string = status;
  let color = "bg-slate-800 text-slate-300 border-slate-700";
  let icon = <Clock className="w-3.5 h-3.5" />;

  switch (status) {
    case "completed":
      label = "Dokončeno";
      color = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      icon = <Check className="w-3.5 h-3.5" />;
      break;
    case "partial":
      label = "Částečný report";
      color = "bg-amber-500/10 text-amber-400 border-amber-500/30";
      icon = <AlertCircle className="w-3.5 h-3.5" />;
      break;
    case "failed":
      label = "Neúspěšné";
      color = "bg-rose-500/10 text-rose-400 border-rose-500/30";
      icon = <X className="w-3.5 h-3.5" />;
      break;
    case "cancelled":
      label = "Zrušeno";
      color = "bg-slate-700/30 text-slate-400 border-slate-700";
      icon = <X className="w-3.5 h-3.5" />;
      break;
    case "connecting":
    case "fetching_metadata":
    case "analyzing":
    case "validating":
    case "generating_report":
      label = "Probíhá analýza";
      color = "bg-purple-500/10 text-purple-400 border-purple-500/30 animate-pulse";
      icon = <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
}
