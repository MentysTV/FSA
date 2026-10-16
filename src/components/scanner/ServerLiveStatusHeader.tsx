"use client";

import React, { useState } from "react";
import {
  Users,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Radio,
  Play,
  Globe,
  MessageSquare,
  Shield,
  Layers,
  MapPin,
  Sparkles,
} from "lucide-react";
import { DiscordInfo } from "@/lib/scanner/types";

interface Props {
  displayName: string;
  normalizedIdentifier: string;
  online: boolean;
  playersCount: number;
  maxPlayers: number;
  gameType?: string;
  mapName?: string;
  discordInfo?: DiscordInfo;
  serverVars?: Record<string, any>;
  bannerDetail?: string;
  icon?: string;
}

export function ServerLiveStatusHeader({
  displayName,
  normalizedIdentifier,
  online,
  playersCount,
  maxPlayers,
  gameType,
  mapName,
  discordInfo,
  serverVars = {},
  bannerDetail,
  icon,
}: Props) {
  const [copiedConnect, setCopiedConnect] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const cleanName = displayName.replace(/\^[0-9]/g, "").trim();
  const connectCommand = `connect ${normalizedIdentifier}`;
  const fivemLaunchUrl = `fivem://connect/${normalizedIdentifier}`;

  const occupancy = maxPlayers > 0 ? Math.min(100, Math.round((playersCount / maxPlayers) * 100)) : 0;

  const handleCopyConnect = () => {
    navigator.clipboard.writeText(connectCommand);
    setCopiedConnect(true);
    setTimeout(() => setCopiedConnect(false), 2000);
  };

  const handleCopyDiscord = () => {
    if (discordInfo?.inviteUrl) {
      navigator.clipboard.writeText(discordInfo.inviteUrl);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2000);
    }
  };

  const projectDesc = serverVars.sv_projectDesc || serverVars.description || "";

  return (
    <div className="bg-[#131722] border border-[#252B3A] rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Background Banner if present */}
      {bannerDetail && (
        <div
          className="h-32 w-full bg-cover bg-center border-b border-[#252B3A] opacity-40 relative"
          style={{ backgroundImage: `url(${bannerDetail})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-transparent to-transparent" />
        </div>
      )}

      <div className="p-6 sm:p-8 space-y-6">
        {/* Main Identity & Status Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#252B3A]">
          <div className="flex items-start gap-4">
            {icon ? (
              <img
                src={icon.startsWith("data:") ? icon : `data:image/png;base64,${icon}`}
                alt="Server Icon"
                className="w-16 h-16 rounded-2xl border-2 border-[#8B5CF6]/40 object-cover shadow-lg shadow-[#8B5CF6]/10 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#0E1118] border border-[#252B3A] flex items-center justify-center flex-shrink-0 text-[#8B5CF6]">
                <Radio className="w-8 h-8 animate-pulse" />
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                {online ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    OFFLINE
                  </span>
                )}

                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#0E1118] text-slate-400 border border-[#252B3A]">
                  {normalizedIdentifier}
                </span>

                {serverVars.onesync_enabled && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    OneSync
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {cleanName || normalizedIdentifier}
              </h1>

              {projectDesc && (
                <p className="text-xs text-slate-400 max-w-2xl line-clamp-2">
                  {projectDesc}
                </p>
              )}
            </div>
          </div>

          {/* Quick Connect & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-end lg:self-center">
            {/* Direct FiveM Protocol Launch */}
            <a
              href={fivemLaunchUrl}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              Spustit FiveM
            </a>

            {/* Copy F8 Console Command */}
            <button
              onClick={handleCopyConnect}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0E1118] hover:bg-[#1a1f2e] border border-[#252B3A] text-slate-300 text-xs font-medium transition-all"
              title="Kopírovat F8 příkaz do konzole"
            >
              {copiedConnect ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedConnect ? "Zkopírováno!" : "F8 Connect"}</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Bar: Players occupancy & Discord */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Players Occupancy Card */}
          <div className="bg-[#0E1118] border border-[#252B3A] rounded-xl p-4 space-y-2 md:col-span-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Users className="w-4 h-4 text-[#38BDF8]" />
                Aktuální zaplnění serveru
              </span>
              <span className="font-mono text-white font-bold">
                <span className="text-lg text-[#38BDF8]">{playersCount}</span> / {maxPlayers} Hráčů ({occupancy}%)
              </span>
            </div>

            {/* Occupancy Progress Bar */}
            <div className="w-full bg-[#131722] rounded-full h-2.5 overflow-hidden border border-[#252B3A]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  occupancy > 80
                    ? "bg-gradient-to-r from-amber-500 to-red-500"
                    : occupancy > 50
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-500"
                }`}
                style={{ width: `${Math.max(2, occupancy)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
              <span>Herní mód: {gameType || "Roleplay"}</span>
              <span>Mapa: {mapName || "Los Santos"}</span>
            </div>
          </div>

          {/* Discord Server Discovery Card */}
          <div className="bg-[#0E1118] border border-[#252B3A] rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                  Oficiální Discord
                </span>
                {discordInfo?.found ? (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    Nalezen
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">Nezjištěn</span>
                )}
              </div>

              {discordInfo?.found && discordInfo.inviteUrl ? (
                <div className="pt-1">
                  <div className="text-xs font-bold text-white truncate font-mono">
                    discord.gg/{discordInfo.inviteCode || "invite"}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Nalezeno v: {discordInfo.source || "server vars"}
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 pt-1">
                  Server neuvádí veřejný Discord odkaz v proměnných.
                </p>
              )}
            </div>

            {discordInfo?.found && discordInfo.inviteUrl && (
              <div className="flex items-center gap-2 pt-3">
                <a
                  href={discordInfo.inviteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-all shadow-md shadow-[#5865F2]/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Připojit se
                </a>
                <button
                  onClick={handleCopyDiscord}
                  className="px-2.5 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1f2537] border border-[#252B3A] text-slate-300 text-xs transition-colors"
                  title="Kopírovat Discord odkaz"
                >
                  {copiedDiscord ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
