import React from "react";
import Link from "next/link";
import { Layers, Search, ExternalLink, Package, ArrowRight, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function ResourcesCatalogPage(props: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await props.searchParams;
  const searchQuery = q || "";
  const currentCategory = category || "all";

  const whereClause: any = {};
  if (currentCategory && currentCategory !== "all") {
    whereClause.category = currentCategory;
  }
  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery } },
      { slug: { contains: searchQuery } },
      { description: { contains: searchQuery } },
      { author: { contains: searchQuery } },
    ];
  }

  const resources = await prisma.resourceCatalog.findMany({
    where: whereClause,
    orderBy: { name: "asc" },
  });

  const categories = [
    { id: "all", label: "Všechny kategorie" },
    { id: "core", label: "Core Frameworky" },
    { id: "inventory", label: "Inventáře" },
    { id: "interaction", label: "Interakce" },
    { id: "police_ems", label: "Policie / MDT" },
    { id: "vehicles", label: "Vozidla & Garáže" },
    { id: "economy", label: "Ekonomika" },
    { id: "phone", label: "Smartphony" },
    { id: "hud", label: "HUD & Hlas" },
    { id: "anticheat", label: "Anticheat" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-xs font-medium text-purple-300 mb-2">
            <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Verifikovaný FiveM Katalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Katalog Známých FiveM Resources</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Prohlížejte ověřené technologie, oficiální dokumentace a způsoby, kterými FSD PRO
            identifikuje spuštěné skripty na serverech.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#131722] border border-[#252B3A] p-3 rounded-2xl">
          <form method="GET" action="/resources" className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Hledat podle názvu skriptu, autora nebo popisu..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0E1118] border border-[#252B3A] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
            />
            {currentCategory !== "all" && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/resources?category=${cat.id}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  currentCategory === cat.id
                    ? "bg-[#8B5CF6] text-white"
                    : "bg-[#0E1118] text-slate-400 hover:text-white border border-[#252B3A]"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((item) => (
            <div
              key={item.slug}
              className="bg-[#131722] border border-[#252B3A] hover:border-[#3b455c] rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#1e2333] border border-[#252B3A] flex items-center justify-center text-[#38BDF8]">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0E1118] text-purple-300 border border-purple-500/20">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-[#8B5CF6] transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">Autor: {item.author || "Komunita"}</div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {item.supportedFrameworks && (
                  <div className="text-[11px] text-slate-400 pt-1">
                    <span className="text-slate-500">Kompatibilita:</span>{" "}
                    <span className="text-slate-300 font-medium">{item.supportedFrameworks}</span>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-[#252B3A] flex items-center justify-between text-xs">
                <Link
                  href={`/resources/${item.slug}`}
                  className="font-semibold text-[#8B5CF6] hover:text-[#a855f7] flex items-center gap-1 transition-colors"
                >
                  <span>Detaily detekce</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {item.documentationUrl && (
                  <a
                    href={item.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Dokumentace</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
