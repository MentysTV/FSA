import React from "react";
import Link from "next/link";
import { Layers, ArrowLeft, Package, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const resources = await prisma.resourceCatalog.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { scanResults: true } },
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
          <h1 className="text-2xl sm:text-3xl font-black text-white">Správa Katalogu Resources</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Seznam všech registrovaných frameworků, knihoven a herních skriptů v databázi detekčních pravidel.
          </p>
        </div>

        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252B3A] bg-[#0E1118]/80 text-slate-400">
                <th className="p-4">Název</th>
                <th className="p-4">Identifikátor (Slug)</th>
                <th className="p-4">Kategorie</th>
                <th className="p-4">Autor</th>
                <th className="p-4">Počet detekcí v reportech</th>
                <th className="p-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B3A]">
              {resources.map((res) => (
                <tr key={res.id} className="hover:bg-[#161b29]">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#38BDF8]" />
                    {res.name}
                  </td>
                  <td className="p-4 font-mono text-purple-300">{res.slug}</td>
                  <td className="p-4 font-mono text-slate-400">{res.category}</td>
                  <td className="p-4 text-slate-300">{res.author || "Komunita"}</td>
                  <td className="p-4 font-mono text-slate-300">{res._count.scanResults}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/resources/${res.slug}`}
                      className="text-[#8B5CF6] hover:underline"
                    >
                      Katalog
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
