import React from "react";
import { CheckCircle2, ShieldAlert, AlertTriangle, HelpCircle, XCircle } from "lucide-react";
import { VerificationStatus } from "@/lib/scanner/types";

interface Props {
  status: VerificationStatus;
  score?: number;
  showScore?: boolean;
}

export function ConfidenceBadge({ status, score, showScore = true }: Props) {
  let label = "Nezjištěno";
  let bgClass = "bg-slate-800 text-slate-300 border-slate-700";
  let Icon = HelpCircle;

  switch (status) {
    case "confirmed":
      label = "Potvrzeno";
      bgClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      Icon = CheckCircle2;
      break;
    case "strong_evidence":
      label = "Silné důkazy";
      bgClass = "bg-purple-500/10 text-purple-400 border-purple-500/30";
      Icon = ShieldAlert;
      break;
    case "weak_evidence":
      label = "Slabé důkazy";
      bgClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
      Icon = AlertTriangle;
      break;
    case "unverified":
      label = "Neověřeno";
      bgClass = "bg-slate-700/20 text-slate-400 border-slate-700/50";
      Icon = HelpCircle;
      break;
    case "not_detected":
      label = "Nezjištěno";
      bgClass = "bg-rose-500/10 text-rose-400 border-rose-500/30";
      Icon = XCircle;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bgClass}`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{label}</span>
      {showScore && score !== undefined && (
        <span className="font-mono text-[10px] opacity-80 pl-1 border-l border-current/20">
          {score}%
        </span>
      )}
    </span>
  );
}
