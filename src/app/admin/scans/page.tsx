import React from "react";
import Link from "next/link";
import { Radar, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScanStatusBadge } from "@/components/scanner/ScanStatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminScansPage() {
  const scans = await prisma.scan.findMany({
    take: 50,
    orderBy: { startedAt: "desc" },
    include: {
      target: true,
      user: { select: { username: true } },
      _count: { select: { results: true, evidences: true } },
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na administrační přehled
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Správa Systémových Analýz</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Seznam všech spuštěných úloh skenování, chybových kódů a nalezených výsledků.
          </p>
        </div>

        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252B3A] bg-[#0E1118]/80 text-slate-400">
                <th className="p-4">Stav</th>
                <th className="p-4">Server</th>
                <th className="p-4">Zadavatel</th>
                <th className="p-4">Režim</th>
                <th className="p-4">Nálezů / Důkazů</th>
                <th className="p-4">Čas</th>
                <th className="p-4 text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B3A]">
              {scans.map((s) => (
                <tr key={s.id} className="hover:bg-[#161b29]">
                  <td className="p-4">
                    <ScanStatusBadge status={s.status as any} />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white truncate max-w-[220px]">
                      {s.target.displayName}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {s.target.normalizedIdentifier}
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {s.user?.username || <span className="text-slate-500">Anonymní</span>}
                  </td>
                  <td className="p-4 font-mono text-[11px] capitalize text-purple-300">
                    {s.scanMode}
                  </td>
                  <td className="p-4 font-mono text-slate-400">
                    {s._count.results} nálezů / {s._count.evidences} důkazů
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(s.startedAt).toLocaleString("cs-CZ")}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/reports/${s.id}`}
                      className="inline-flex items-center gap-1 text-xs text-[#38BDF8] hover:underline"
                    >
                      <span>Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
