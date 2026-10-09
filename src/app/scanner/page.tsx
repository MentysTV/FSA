"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Radar, Shield, Globe, Terminal, Clock, Server, ArrowRight, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServerSearchForm } from "@/components/scanner/ServerSearchForm";
import { ScanProgress } from "@/components/scanner/ScanProgress";
import { ScanMode, ScanStatus } from "@/lib/scanner/types";

export default function ScannerPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ScanStatus>("validating");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeScanId, setActiveScanId] = useState<string | null>(null);

  const handleStartScan = async (target: string, mode: ScanMode, notes?: string) => {
    setIsScanning(true);
    setErrorMessage("");
    setCurrentStatus("validating");

    try {
      // Simulate stepped progression indicator for smooth UX
      const statusTimer1 = setTimeout(() => setCurrentStatus("connecting"), 600);
      const statusTimer2 = setTimeout(() => setCurrentStatus("fetching_metadata"), 1300);
      const statusTimer3 = setTimeout(() => setCurrentStatus("analyzing"), 2100);

      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, scanMode: mode, notes }),
      });

      clearTimeout(statusTimer1);
      clearTimeout(statusTimer2);
      clearTimeout(statusTimer3);

      const data = await res.json();

      if (!res.ok || data.error) {
        setCurrentStatus("failed");
        setErrorMessage(data.error || "Při analýze serveru došlo k chybě.");
        return;
      }

      setCurrentStatus("generating_report");
      const scanId = data.report.scanId;
      setActiveScanId(scanId);

      // Short delay to show completed status before navigating to full report
      setTimeout(() => {
        router.push(`/reports/${scanId}`);
      }, 700);
    } catch (err: any) {
      setCurrentStatus("failed");
      setErrorMessage(err.message || "Síťová chyba při odesílání požadavku.");
    }
  };

  const handleCancel = () => {
    setIsScanning(false);
    setCurrentStatus("cancelled");
    setErrorMessage("Analýza byla přerušena uživatelem.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-xs font-medium text-purple-300">
            <Radar className="w-3.5 h-3.5 text-[#8B5CF6] animate-spin" />
            FiveM Scanner Engine v1.0
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Skenování FiveM serveru
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Zadejte IP adresu s portem nebo kód Cfx.re a spusťte nezávislou analýzu dostupných metadat.
          </p>
        </div>

        {/* Search & Setup Form */}
        <div className="bg-[#131722]/60 border border-[#252B3A] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm mb-8">
          <ServerSearchForm onScanStart={handleStartScan} isLoading={isScanning} />
        </div>

        {/* Live Progress Card when active */}
        {isScanning && (
          <div className="mb-8">
            <ScanProgress
              currentStatus={currentStatus}
              errorMessage={errorMessage}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Quick Tips & Presets */}
        {!isScanning && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Box 1 */}
            <div className="bg-[#131722] border border-[#252B3A] rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Globe className="w-4 h-4 text-[#38BDF8]" />
                Veřejný režim (Public Scan)
              </div>
              <p className="text-slate-400 leading-relaxed">
                Vhodný pro jakýkoliv běžící FiveM server. Dotazuje se výhradně na veřejné JSON
                endpointy bez nutnosti instalace jakéhokoliv doplňku na server.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-[#131722] border border-[#252B3A] rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Shield className="w-4 h-4 text-emerald-400" />
                Autorizovaný režim pro majitele
              </div>
              <p className="text-slate-400 leading-relaxed">
                Nainstalujte serverový resource{" "}
                <code className="text-purple-300 bg-[#0E1118] px-1.5 py-0.5 rounded">fsd_agent</code>{" "}
                pro garantovaný 100% soupis schválených resources a manifestů.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
