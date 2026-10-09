import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FSD PRO | FiveM Script Detector & Server Analyzer",
  description:
    "Odhal technologie, které pohánějí FiveM servery. Pokročilý analytický nástroj pro kontrolu veřejných metadat, identifikaci frameworků a dokumentování dostupných informací o FiveM serverech.",
  keywords: [
    "FiveM",
    "FiveM Script Scanner",
    "FSD PRO",
    "FiveM Server Detector",
    "ESX",
    "QBCore",
    "ox_inventory",
    "ox_lib",
    "GTA RP",
  ],
  authors: [{ name: "FSD Security & Engineering Team" }],
  openGraph: {
    title: "FSD PRO | FiveM Script Detector",
    description: "Discover the technology behind FiveM servers with verifiable evidence.",
    url: "https://fsd-scanner.local",
    siteName: "FSD PRO",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-[#08090D] text-[#F8FAFC] antialiased selection:bg-[#8B5CF6]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
