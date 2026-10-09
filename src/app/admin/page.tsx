"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  Radar,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  ArrowRight,
  Activity,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          throw new Error("Přístup odepřen: Vyžadována administrátorská role.");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.error) setError(resData.error);
        else setData(resData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-medium text-purple-300 mb-2">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Administrátorská Konzole
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">FSD PRO – Systémový Přehled</h1>
          </div>

          {/* Quick Admin subnav links */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/admin/users"
              className="px-3 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1e2333] border border-[#252B3A] text-slate-300"
            >
              Uživatelé
            </Link>
            <Link
              href="/admin/scans"
              className="px-3 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1e2333] border border-[#252B3A] text-slate-300"
            >
              Analýzy
            </Link>
            <Link
              href="/admin/resources"
              className="px-3 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1e2333] border border-[#252B3A] text-slate-300"
            >
              Katalog
            </Link>
            <Link
              href="/admin/settings"
              className="px-3 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1e2333] border border-[#252B3A] text-slate-300"
            >
              Nastavení & Audit
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400">Načítám administrátorská data...</div>
        ) : error ? (
          <div className="bg-[#131722] border border-rose-500/30 rounded-2xl p-8 text-center space-y-3">
            <Lock className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Omezený přístup</h3>
            <p className="text-xs text-rose-300">{error}</p>
            <div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-xs font-semibold"
              >
                Přihlásit se jako administrátor
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Celkem uživatelů</span>
                  <Users className="w-4 h-4 text-[#38BDF8]" />
                </div>
                <div className="text-2xl font-black text-white">{data.stats.totalUsers}</div>
              </div>

              <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Celkem skenů</span>
                  <Radar className="w-4 h-4 text-[#8B5CF6]" />
                </div>
                <div className="text-2xl font-black text-white">{data.stats.totalScans}</div>
                <div className="text-[10px] text-emerald-400">{data.stats.completedScans} dokončeno</div>
              </div>

              <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Úspěšnost skenování</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">{data.stats.successRate}%</div>
                <div className="text-[10px] text-rose-400">{data.stats.failedScans} chyb / offline</div>
              </div>

              <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Položek v katalogu</span>
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">{data.stats.totalResources}</div>
                <div className="text-[10px] text-slate-500">verifikované scripts</div>
              </div>
            </div>

            {/* Recent Scans & Audit Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Scans */}
              <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Poslední systémové analýzy</h3>
                  <Link href="/admin/scans" className="text-xs text-[#8B5CF6] hover:underline">
                    Zobrazit vše
                  </Link>
                </div>

                <div className="divide-y divide-[#252B3A] text-xs">
                  {data.recentScans.map((scan: any) => (
                    <div key={scan.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white truncate max-w-[220px]">
                          {scan.target.displayName}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {scan.target.normalizedIdentifier}
                        </div>
                      </div>
                      <Link
                        href={`/reports/${scan.id}`}
                        className="text-[#38BDF8] hover:underline font-mono text-[11px]"
                      >
                        Detail reportu
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Logs */}
              <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Poslední bezpečnostní události (Audit)</h3>
                  <Link href="/admin/settings" className="text-xs text-[#8B5CF6] hover:underline">
                    Celý audit
                  </Link>
                </div>

                <div className="divide-y divide-[#252B3A] text-xs">
                  {data.recentAudits.map((log: any) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-purple-300 font-semibold">{log.action}</span>
                        <div className="text-[10px] text-slate-500">
                          Uživatel: {log.actor?.username || "Systém"}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleTimeString("cs-CZ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
