"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, Package, Shield, ExternalLink } from "lucide-react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { TechnologyDetection } from "@/lib/scanner/types";

interface Props {
  resources: TechnologyDetection[];
  title?: string;
  subtitle?: string;
}

export function ResourceTable({ resources, title = "Detekované Resources & Skripty", subtitle }: Props) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "Všechny" },
    { id: "inventory", label: "Inventář" },
    { id: "interaction", label: "Interakce" },
    { id: "police_ems", label: "Policie / EMS" },
    { id: "vehicles", label: "Vozidla" },
    { id: "economy", label: "Ekonomika" },
    { id: "phone", label: "Telefony" },
    { id: "hud", label: "HUD / Hlas" },
    { id: "anticheat", label: "Anticheat" },
  ];

  const filtered = resources.filter((res) => {
    const matchesCat = categoryFilter === "all" || res.category === categoryFilter;
    const matchesQuery =
      !query ||
      res.name.toLowerCase().includes(query.toLowerCase()) ||
      res.slug.toLowerCase().includes(query.toLowerCase()) ||
      res.summary.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="bg-[#131722] border border-[#252B3A] rounded-2xl overflow-hidden shadow-xl">
      {/* Header and Controls */}
      <div className="p-5 border-b border-[#252B3A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#38BDF8]" />
            {title} ({resources.length})
          </h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hledat v nalezených..."
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#0E1118] border border-[#252B3A] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6] w-full sm:w-48"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0E1118] border border-[#252B3A] text-xs text-slate-300 focus:outline-none focus:border-[#8B5CF6]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table content */}
      {filtered.length === 0 ? (
        <div className="p-10 text-center text-slate-400 text-xs">
          Nebyly nalezeny žádné resources odpovídající filtru.
        </div>
      ) : (
        <div className="divide-y divide-[#252B3A]">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.slug;
            return (
              <div key={item.slug} className="hover:bg-[#161b29] transition-colors">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.slug)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1e2333] border border-[#252B3A] flex items-center justify-center flex-shrink-0 text-[#38BDF8]">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{item.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0E1118] text-slate-400 border border-[#252B3A]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto">
                    <ConfidenceBadge
                      status={item.verificationStatus}
                      score={item.confidenceScore}
                    />
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Evidence detail */}
                {isExpanded && item.evidences && item.evidences.length > 0 && (
                  <div className="px-5 pb-4 pt-1 bg-[#0E1118]/70 border-t border-[#252B3A]/60">
                    <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      Zdrojové důkazy ({item.evidences.length}):
                    </div>
                    <div className="space-y-2">
                      {item.evidences.map((ev, i) => (
                        <div
                          key={i}
                          className="bg-[#131722] p-3 rounded-lg border border-[#252B3A] text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                            <span className="text-[#38BDF8]">{ev.sourceType}</span>
                            <span className="text-slate-500">{ev.sourceReference}</span>
                          </div>
                          <div className="text-slate-200">{ev.description}</div>
                          {ev.rawValue && (
                            <div className="bg-[#08090D] px-2 py-1 rounded font-mono text-[11px] text-purple-300">
                              {ev.rawValue}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
