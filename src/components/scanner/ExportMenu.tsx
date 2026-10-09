"use client";

import React, { useState } from "react";
import { Download, FileText, Share2, Check, Printer } from "lucide-react";
import jsPDF from "jspdf";
import { ScanReportSummary } from "@/lib/scanner/types";

interface Props {
  report: ScanReportSummary;
  rawScan?: any;
}

export function ExportMenu({ report, rawScan }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleExportJson = () => {
    const payload = rawScan || report;
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fsd_report_${report.targetId}_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const margin = 14;
    let y = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(139, 92, 246);
    doc.text("FSD PRO - FiveM Server Analysis Report", margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Analyzovano: ${new Date(report.startedAt).toLocaleString("cs-CZ")}`, margin, y);
    y += 10;

    // Server Info
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Server: ${report.displayName}`, margin, y);
    y += 6;

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Cil: ${report.normalizedIdentifier} | Rezim: ${report.scanMode} | Stav: ${report.status}`, margin, y);
    y += 5;
    doc.text(`Hraci: ${report.playersCount} / ${report.maxPlayers} | Celkova mira jistoty: ${report.averageConfidence}%`, margin, y);
    y += 12;

    // Frameworks
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Detekovane Frameworky:", margin, y);
    y += 6;

    doc.setFontSize(9);
    if (report.detectedFrameworks.length === 0) {
      doc.text("Zadny znamy framework nebyl s jistotou detekovan.", margin, y);
      y += 6;
    } else {
      for (const fw of report.detectedFrameworks) {
        doc.text(`• ${fw.name} (${fw.verificationStatus}) - Skore: ${fw.confidenceScore}%`, margin, y);
        y += 5;
      }
    }
    y += 6;

    // Resources
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Detekovane Resources (${report.detectedResources.length}):`, margin, y);
    y += 6;

    doc.setFontSize(9);
    for (const res of report.detectedResources.slice(0, 15)) {
      doc.text(`- ${res.name} [${res.category}] - ${res.verificationStatus} (${res.confidenceScore}%)`, margin, y);
      y += 5;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    if (report.detectedResources.length > 15) {
      doc.text(`... a dalsich ${report.detectedResources.length - 15} polozek.`, margin, y);
      y += 6;
    }
    y += 8;

    // Limitations
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Omezeni a bezpecnostni metodika:", margin, y);
    y += 5;

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Tento report vychazi vyhradne z verejne ziskanych a overitelnych metadat.", margin, y);
    y += 4;
    doc.text("Zadne skryte soubory serveru nebyly cteny bez autorizace vlastnika.", margin, y);

    doc.save(`fsd_report_${report.targetId}.pdf`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1a202e] border border-[#252B3A] text-xs font-medium text-slate-300 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Zkopírováno!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Sdílet odkaz</span>
          </>
        )}
      </button>

      <button
        onClick={handleExportJson}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1a202e] border border-[#252B3A] text-xs font-medium text-slate-300 transition-colors"
      >
        <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
        <span>Exportovat JSON</span>
      </button>

      <button
        onClick={handleExportPdf}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1a202e] border border-[#252B3A] text-xs font-medium text-slate-300 transition-colors"
      >
        <FileText className="w-3.5 h-3.5 text-emerald-400" />
        <span>Exportovat PDF</span>
      </button>

      <button
        onClick={() => typeof window !== "undefined" && window.print()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1a202e] border border-[#252B3A] text-xs font-medium text-slate-300 transition-colors"
      >
        <Printer className="w-3.5 h-3.5 text-slate-400" />
        <span>Tisk</span>
      </button>
    </div>
  );
}
