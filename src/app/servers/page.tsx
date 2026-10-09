import React from "react";
import Link from "next/link";
import { Server, Users, Search, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function ServersListPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await props.searchParams;
  const searchQuery = q || "";

  const servers = await prisma.serverTarget.findMany({
    where: searchQuery
      ? {
          OR: [
            { displayName: { contains: searchQuery } },
            { normalizedIdentifier: { contains: searchQuery } },
          ],
        }
      : undefined,
    take: 40,
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { scans: true },
      },
      scans: {
        take: 1,
        orderBy: { startedAt: "desc" },
        select: {
          id: true,
          status: true,
          startedAt: true,
          scanMode: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Analyzované FiveM Servery</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Databáze dříve skenovaných serverů a jejich posledních dostupných metadat.
            </p>
          </div>

          {/* Search bar */}
          <form method="GET" action="/servers" className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Hledat podle IP nebo názvu..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131722] border border-[#252B3A] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
            />
          </form>
        </div>

        {/* Server Cards Grid */}
        {servers.length === 0 ? (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <Server className="w-10 h-10 mx-auto text-slate-600" />
            <div className="text-sm font-semibold text-slate-300">Nebyly nalezeny žádné servery</div>
            <p className="text-xs">Zkuste zadat jiný vyhledávací dotaz nebo spusťte novou analýzu.</p>
            <div>
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-xs font-medium"
              >
                Přejít na skener
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((server) => {
              const latestScan = server.scans[0];
              return (
                <div
                  key={server.id}
                  className="bg-[#131722] border border-[#252B3A] hover:border-[#3b455c] rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            server.lastOnlineStatus
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-slate-500"
                          }`}
                        ></span>
                        <span className="font-mono text-[11px] text-slate-400 truncate max-w-[170px]">
                          {server.normalizedIdentifier}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0E1118] text-slate-400 border border-[#252B3A]">
                        {server._count.scans} {server._count.scans === 1 ? "sken" : "skeny"}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                      {server.displayName}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                        {server.lastPlayers} / {server.lastMaxPlayers || 32}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(server.updatedAt).toLocaleDateString("cs-CZ")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[#252B3A] flex items-center justify-between">
                    <Link
                      href={`/servers/${server.id}`}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Detail serveru
                    </Link>

                    {latestScan && (
                      <Link
                        href={`/reports/${latestScan.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B5CF6] hover:text-[#a855f7] transition-colors"
                      >
                        <span>Poslední report</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
