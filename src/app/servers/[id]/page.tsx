import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Server, Users, Clock, RotateCw, ArrowLeft, ArrowRight, Shield, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScanStatusBadge } from "@/components/scanner/ScanStatusBadge";

export const dynamic = "force-dynamic";

export default async function ServerProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const server = await prisma.serverTarget.findUnique({
    where: { id },
    include: {
      scans: {
        orderBy: { startedAt: "desc" },
        take: 30,
        include: {
          _count: {
            select: { results: true },
          },
        },
      },
    },
  });

  if (!server) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link
          href="/servers"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na seznam serverů
        </Link>

        {/* Server Profile Header */}
        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  server.lastOnlineStatus ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                }`}
              ></span>
              <span className="font-mono text-xs text-[#8B5CF6] font-semibold">
                {server.normalizedIdentifier}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">{server.displayName}</h1>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                {server.lastPlayers} / {server.lastMaxPlayers || 32} Hráčů
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                Naposledy skenováno: {new Date(server.updatedAt).toLocaleString("cs-CZ")}
              </span>
            </div>
          </div>

          <div>
            <Link
              href={`/scanner?target=${encodeURIComponent(server.normalizedIdentifier)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-semibold text-xs shadow-lg shadow-[#8B5CF6]/30 transition-all"
            >
              <RotateCw className="w-4 h-4" />
              Spustit novou analýzu
            </Link>
          </div>
        </div>

        {/* Scans Timeline / History */}
        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#252B3A]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8B5CF6]" />
              Historie provedených analýz tohoto serveru ({server.scans.length})
            </h2>
          </div>

          {server.scans.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Pro tento server nebyla nalezena žádná historie skenů.
            </div>
          ) : (
            <div className="divide-y divide-[#252B3A]">
              {server.scans.map((scan) => (
                <div
                  key={scan.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#161b29] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <ScanStatusBadge status={scan.status as any} />
                      <span className="font-mono text-xs text-slate-300">
                        {new Date(scan.startedAt).toLocaleString("cs-CZ")}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#0E1118] text-slate-400 border border-[#252B3A] capitalize">
                        {scan.scanMode}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Nalezeno {scan._count.results} technologických záznamů
                    </div>
                  </div>

                  <Link
                    href={`/reports/${scan.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8] hover:text-[#7dd3fc] transition-colors self-end sm:self-auto"
                  >
                    <span>Zobrazit report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
