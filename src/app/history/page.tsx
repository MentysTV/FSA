"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { History, Trash2, ArrowRight, RotateCw, Server, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScanStatusBadge } from "@/components/scanner/ScanStatusBadge";

export default function HistoryPage() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = () => {
    setLoading(true);
    fetch("/api/history")
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Pro zobrazení historie se musíte nejprve přihlásit.");
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) setError(data.error);
        else setScans(data.scans || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (scanId: string) => {
    if (!confirm("Opravdu si přejete smazat tento report z historie?")) return;

    try {
      const res = await fetch(`/api/reports/${scanId}`, { method: "DELETE" });
      if (res.ok) {
        setScans(scans.filter((s) => s.id !== scanId));
      } else {
        alert("Nepodařilo se smazat report.");
      }
    } catch {
      alert("Chyba při mazání.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-xs font-medium text-purple-300 mb-2">
            <History className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Osobní přehled
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Moje Historie Analýz</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Seznam všech vámi spuštěných analýz serverů. Zde můžete své reporty spravovat nebo mazat.
          </p>
        </div>

        {loading ? (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-12 text-center text-slate-400 text-xs">
            Načítám vaši historii...
          </div>
        ) : error ? (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-xs text-slate-300">{error}</p>
            <div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-xs font-semibold"
              >
                Přejít na přihlášení
              </Link>
            </div>
          </div>
        ) : scans.length === 0 ? (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-12 text-center text-slate-400 text-xs space-y-3">
            <Server className="w-8 h-8 text-slate-600 mx-auto" />
            <p>Zatím jste nespustili žádnou analýzu.</p>
            <div>
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-xs font-semibold"
              >
                Spustit první analýzu
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl overflow-hidden shadow-xl divide-y divide-[#252B3A]">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#161b29] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <ScanStatusBadge status={scan.status} />
                    <span className="font-mono text-xs text-[#8B5CF6] font-semibold">
                      {scan.target.normalizedIdentifier}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(scan.startedAt).toLocaleString("cs-CZ")}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base">{scan.target.displayName}</h3>
                  <div className="text-xs text-slate-400">
                    Nalezeno {scan._count.results} doložených technologických položek
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleDelete(scan.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Smazat report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/reports/${scan.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-purple-300 text-xs font-semibold hover:bg-[#8B5CF6]/30 transition-colors"
                  >
                    <span>Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
