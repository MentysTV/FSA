"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GitCompare, Plus, X, Server, Check, HelpCircle, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConfidenceBadge } from "@/components/scanner/ConfidenceBadge";

export default function ComparePage() {
  const [availableScans, setAvailableScans] = useState<any[]>([]);
  const [selectedScanIds, setSelectedScanIds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load available scans
    fetch("/api/scans?limit=20")
      .then((res) => res.json())
      .then((data) => {
        if (data.scans) {
          setAvailableScans(data.scans);
          // Auto select first two if available
          if (data.scans.length >= 2) {
            setSelectedScanIds([data.scans[0].id, data.scans[1].id]);
          } else if (data.scans.length === 1) {
            setSelectedScanIds([data.scans[0].id]);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedScanIds.length >= 2) {
      setLoading(true);
      setError("");
      fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanIds: selectedScanIds }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else setComparisonData(data.scans || []);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setComparisonData([]);
    }
  }, [selectedScanIds]);

  const toggleScanSelection = (id: string) => {
    if (selectedScanIds.includes(id)) {
      setSelectedScanIds(selectedScanIds.filter((item) => item !== id));
    } else {
      if (selectedScanIds.length >= 4) {
        setError("Lze porovnávat maximálně 4 servery současně.");
        return;
      }
      setSelectedScanIds([...selectedScanIds, id]);
    }
  };

  // Compute union of all detected resource names across compared servers
  const allResourceNames = Array.from(
    new Set(
      comparisonData.flatMap((server) => [
        ...server.frameworks.map((f: any) => f.name),
        ...server.resources.map((r: any) => r.name),
        ...server.systems.map((s: any) => s.name),
      ])
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-xs font-medium text-purple-300 mb-2">
            <GitCompare className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Srovnávací analytický modul
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Porovnání FiveM Serverů</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Vyberte 2 až 4 analyzované servery a porovnejte jejich frameworky, skripty a míru jistoty vedle sebe.
          </p>
        </div>

        {/* Selection Pills */}
        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Dostupné reporty k porovnání (vybráno {selectedScanIds.length} / 4):</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableScans.map((scan) => {
              const isSelected = selectedScanIds.includes(scan.id);
              return (
                <button
                  key={scan.id}
                  onClick={() => toggleScanSelection(scan.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20"
                      : "bg-[#0E1118] border-[#252B3A] text-slate-400 hover:text-white"
                  }`}
                >
                  <Server className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span className="truncate max-w-[200px]">{scan.target.displayName}</span>
                  {isSelected ? <X className="w-3 h-3 text-rose-400" /> : <Plus className="w-3 h-3 text-slate-500" />}
                </button>
              );
            })}
          </div>

          {error && <div className="text-xs text-rose-400 pt-1">{error}</div>}
        </div>

        {/* Comparison Matrix Table */}
        {selectedScanIds.length < 2 ? (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-12 text-center text-slate-400 text-xs">
            Vyberte alespoň 2 servery z nabídky výše pro zobrazení porovnávací matice.
          </div>
        ) : loading ? (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
            Generuji srovnávací tabulku...
          </div>
        ) : (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl overflow-x-auto shadow-2xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#252B3A] bg-[#0E1118]/80">
                  <th className="p-4 font-semibold text-slate-400 min-w-[200px]">Metrika / Technologie</th>
                  {comparisonData.map((s) => (
                    <th key={s.id} className="p-4 font-bold text-white min-w-[220px]">
                      <div className="truncate max-w-[210px]">{s.displayName}</div>
                      <div className="font-mono text-[10px] text-[#8B5CF6] font-normal truncate">
                        {s.targetIdentifier}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252B3A]">
                {/* Players */}
                <tr className="hover:bg-[#161b29]">
                  <td className="p-4 font-medium text-slate-300">Hráči online</td>
                  {comparisonData.map((s) => (
                    <td key={s.id} className="p-4 font-mono text-slate-300">
                      {s.playersCount} / {s.maxPlayers || 32}
                    </td>
                  ))}
                </tr>

                {/* Frameworks */}
                <tr className="hover:bg-[#161b29] bg-[#0E1118]/40">
                  <td className="p-4 font-medium text-purple-300">Core Framework</td>
                  {comparisonData.map((s) => (
                    <td key={s.id} className="p-4">
                      {s.frameworks.length > 0 ? (
                        <div className="space-y-1">
                          {s.frameworks.map((f: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="font-bold text-white">{f.name}</span>
                              <ConfidenceBadge
                                status={f.verificationStatus}
                                score={f.confidenceScore}
                                showScore={false}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Nezjištěno</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Detected Resources Matrix */}
                {allResourceNames.map((resName) => (
                  <tr key={resName} className="hover:bg-[#161b29]">
                    <td className="p-4 font-medium text-slate-200">{resName}</td>
                    {comparisonData.map((s) => {
                      const allFound = [...s.frameworks, ...s.resources, ...s.systems];
                      const match = allFound.find((item: any) => item.name === resName);

                      return (
                        <td key={s.id} className="p-4">
                          {match ? (
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <ConfidenceBadge
                                status={match.verificationStatus}
                                score={match.confidenceScore}
                                showScore={false}
                              />
                            </div>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
