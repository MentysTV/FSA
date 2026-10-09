"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Database, Key, Clock, FileText, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AdminSettingsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/audit")
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setLogs(data.logs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na administrační přehled
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Nastavení Systému & Bezpečnostní Audit</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Konfigurace SSRF ochrany, rychlostních limitů a auditní protokol akcí.
          </p>
        </div>

        {/* System Health and Config Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              SSRF Guard & Síťová Ochrana
            </div>
            <div className="space-y-1 text-slate-400">
              <div className="flex items-center justify-between">
                <span>DNS Rebinding Guard:</span>
                <span className="text-emerald-400 font-mono">AKTIVNÍ</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Loopback & RFC1918 Block:</span>
                <span className="text-emerald-400 font-mono">AKTIVNÍ</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cloud Metadata Block:</span>
                <span className="text-emerald-400 font-mono">AKTIVNÍ</span>
              </div>
            </div>
          </div>

          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Clock className="w-4 h-4 text-[#38BDF8]" />
              Limity a Omezení
            </div>
            <div className="space-y-1 text-slate-400">
              <div className="flex items-center justify-between">
                <span>Timeout požadavku:</span>
                <span className="text-slate-200 font-mono">6 000 ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Max velikost odpovědi:</span>
                <span className="text-slate-200 font-mono">2 MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rate limit na IP:</span>
                <span className="text-slate-200 font-mono">10 skenů / min</span>
              </div>
            </div>
          </div>

          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Database className="w-4 h-4 text-purple-400" />
              Databázová Vrstva
            </div>
            <div className="space-y-1 text-slate-400">
              <div className="flex items-center justify-between">
                <span>ORM:</span>
                <span className="text-slate-200 font-mono">Prisma v6</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Režim:</span>
                <span className="text-slate-200 font-mono">SQLite (Zero-config)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Postgres Ready:</span>
                <span className="text-emerald-400 font-mono">ANO (via DATABASE_URL)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#252B3A]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8B5CF6]" />
              Auditní Záznamy (Audit Log)
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Načítám auditní záznamy...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">Zatím nebyly zaznamenány žádné události.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#252B3A] bg-[#0E1118]/80 text-slate-400">
                    <th className="p-4">Čas</th>
                    <th className="p-4">Akce</th>
                    <th className="p-4">Uživatel</th>
                    <th className="p-4">Entita</th>
                    <th className="p-4">Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252B3A]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#161b29]">
                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleString("cs-CZ")}
                      </td>
                      <td className="p-4 font-mono font-bold text-purple-300">{log.action}</td>
                      <td className="p-4 text-slate-300">
                        {log.actor?.username || <span className="text-slate-500">Systém</span>}
                      </td>
                      <td className="p-4 font-mono text-slate-400">{log.entityType}</td>
                      <td className="p-4 font-mono text-slate-400 truncate max-w-[280px]">
                        {log.metadata || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
