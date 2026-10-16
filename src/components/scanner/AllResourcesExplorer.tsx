"use client";

import React, { useState } from "react";
import {
  Layers,
  Search,
  Copy,
  Check,
  Download,
  Shield,
  MapPin,
  Car,
  Shirt,
  Cpu,
  Package,
  Smartphone,
  Briefcase,
  Gamepad2,
  Terminal,
  Filter,
} from "lucide-react";
import { CategorizedResource } from "@/lib/scanner/types";

interface Props {
  resources: CategorizedResource[];
  serverName?: string;
}

export function AllResourcesExplorer({ resources, serverName = "fivem-server" }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Group counts
  const counts = {
    all: resources.length,
    anticheat: resources.filter((r) => r.type === "anticheat").length,
    mlo: resources.filter((r) => r.type === "mlo").length,
    vehicle: resources.filter((r) => r.type === "vehicle").length,
    clothing: resources.filter((r) => r.type === "clothing").length,
    framework: resources.filter((r) => r.type === "framework").length,
    inventory: resources.filter((r) => r.type === "inventory").length,
    phone: resources.filter((r) => r.type === "phone").length,
    job: resources.filter((r) => r.type === "job").length,
    gameplay: resources.filter((r) => r.type === "gameplay").length,
    other: resources.filter((r) => r.type === "standalone" || r.type === "other").length,
  };

  const categories = [
    { id: "all", label: "Všechny", count: counts.all, icon: Layers },
    { id: "anticheat", label: "Anticheaty", count: counts.anticheat, icon: Shield, badgeColor: "text-red-400 border-red-500/30 bg-red-500/10" },
    { id: "mlo", label: "MLO & Mapy", count: counts.mlo, icon: MapPin, badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { id: "vehicle", label: "Vozidla & Zvuky", count: counts.vehicle, icon: Car, badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { id: "clothing", label: "Oblečení & EUP", count: counts.clothing, icon: Shirt, badgeColor: "text-pink-400 border-pink-500/30 bg-pink-500/10" },
    { id: "framework", label: "Jádro & Framework", count: counts.framework, icon: Cpu, badgeColor: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
    { id: "inventory", label: "Inventáře", count: counts.inventory, icon: Package, badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { id: "phone", label: "Telefony", count: counts.phone, icon: Smartphone, badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
    { id: "job", label: "Práce & MDT", count: counts.job, icon: Briefcase, badgeColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
    { id: "gameplay", label: "Herní Skripty", count: counts.gameplay, icon: Gamepad2, badgeColor: "text-teal-400 border-teal-500/30 bg-teal-500/10" },
    { id: "other", label: "Ostatní", count: counts.other, icon: Terminal, badgeColor: "text-slate-400 border-slate-500/30 bg-slate-500/10" },
  ];

  // Filtering
  const filtered = resources.filter((item) => {
    const matchesCat =
      activeCategory === "all"
        ? true
        : activeCategory === "other"
        ? item.type === "standalone" || item.type === "other"
        : item.type === activeCategory;

    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  const handleCopyAll = () => {
    const names = resources.map((r) => r.name).join("\n");
    navigator.clipboard.writeText(names);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedItem(name);
    setTimeout(() => setCopiedItem(null), 1500);
  };

  const handleDownloadTxt = () => {
    const content = resources.map((r) => `${r.name} [${r.categoryLabel}]`).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${serverName.replace(/[^a-z0-9]/gi, "_")}_resources.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const content = JSON.stringify(resources, null, 2);
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${serverName.replace(/[^a-z0-9]/gi, "_")}_resources.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#131722] border border-[#252B3A] rounded-2xl overflow-hidden shadow-2xl space-y-0">
      {/* Top Header */}
      <div className="p-6 border-b border-[#252B3A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Kompletní soupis serverových Resources
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                  {resources.length} celkem
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                100 % všech skriptů, MLO interiérů, vozidel a systémů zjištěných v manifestu serveru.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Copy All, Download */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E1118] hover:bg-[#1f2537] border border-[#252B3A] text-slate-300 text-xs font-medium transition-colors"
            title="Kopírovat seznam všech resources"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copiedAll ? "Zkopírováno!" : "Kopírovat vše"}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E1118] hover:bg-[#1f2537] border border-[#252B3A] text-slate-300 text-xs font-medium transition-colors"
            title="Stáhnout jako TXT"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>TXT</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E1118] hover:bg-[#1f2537] border border-[#252B3A] text-slate-300 text-xs font-medium transition-colors"
            title="Stáhnout jako JSON"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="px-6 py-3 border-b border-[#252B3A] bg-[#0E1118]/70 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25 font-bold"
                  : "bg-[#131722] text-slate-400 hover:text-white border border-[#252B3A] hover:border-slate-600"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-[#0E1118] text-slate-400"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live Search Input */}
      <div className="p-4 border-b border-[#252B3A] bg-[#10141f]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Vyhledat v ${filtered.length} zobrazených položkách (např. gabz, police, inventory, fiveguard, car)...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08090D] border border-[#252B3A] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
        </div>
      </div>

      {/* Resource Items Grid */}
      <div className="p-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Filter className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">Žádné shody</div>
            <p className="text-xs text-slate-500">
              Pro zadaný filtr nebyly nalezeny žádné resources.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((item) => {
              const isCopied = copiedItem === item.name;
              return (
                <div
                  key={item.name}
                  onClick={() => handleCopySingle(item.name)}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-all cursor-pointer group select-none ${
                    item.isAnticheat
                      ? "bg-red-500/5 border-red-500/30 hover:border-red-500/50"
                      : item.isMlo
                      ? "bg-amber-500/5 border-amber-500/25 hover:border-amber-500/40"
                      : "bg-[#0E1118] border-[#252B3A] hover:border-slate-600"
                  }`}
                  title="Kliknutím zkopírujete název"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono ${
                        item.isAnticheat
                          ? "bg-red-500/20 text-red-300"
                          : item.isMlo
                          ? "bg-amber-500/20 text-amber-300"
                          : item.type === "vehicle"
                          ? "bg-cyan-500/15 text-cyan-300"
                          : item.type === "clothing"
                          ? "bg-pink-500/15 text-pink-300"
                          : item.type === "framework"
                          ? "bg-purple-500/15 text-purple-300"
                          : item.type === "inventory"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : item.type === "phone"
                          ? "bg-blue-500/15 text-blue-300"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.categoryLabel}
                    </span>

                    <button
                      className="text-slate-500 group-hover:text-white transition-colors"
                      title="Kopírovat"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>

                  <div className="mt-2.5">
                    <div className="font-mono text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors truncate">
                      {item.name}
                    </div>
                    {item.description && (
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
