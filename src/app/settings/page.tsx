"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Shield,
  Key,
  Copy,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Server,
  Download,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTarget, setNewTarget] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/integrations").then((r) => r.json()),
    ])
      .then(([userData, integData]) => {
        if (userData?.user) setUser(userData.user);
        if (integData?.integrations) setIntegrations(integData.integrations);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget.trim()) return;
    setError("");

    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetIdentifier: newTarget.trim(),
          displayName: newDisplayName.trim() || newTarget.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Nepodařilo se vytvořit integraci.");
      } else {
        setGeneratedToken(data.apiToken);
        setNewTarget("");
        setNewDisplayName("");
        loadData();
      }
    } catch (err: any) {
      setError(err.message || "Síťová chyba.");
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Opravdu chcete zneplatnit tento API token? Serverový agent přestane synchronizovat.")) return;

    try {
      const res = await fetch(`/api/integrations/${id}/revoke`, { method: "POST" });
      if (res.ok) {
        loadData();
      }
    } catch {
      alert("Chyba při zneplatnění.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Nastavení Účtu & FiveM Integrace</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Správa vašeho profilu, generování API klíčů a autorizované propojení vašich serverů.
          </p>
        </div>

        {/* User Profile Card */}
        {user ? (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center font-bold text-lg text-[#8B5CF6]">
                {user.username.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{user.username}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {user.role}
                  </span>
                </div>
                <div className="text-xs text-slate-400">{user.email}</div>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400 self-end sm:self-auto">
              Celkem analýz: <strong className="text-white">{user._count?.scans ?? 0}</strong>
            </div>
          </div>
        ) : (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 text-center text-xs text-slate-400">
            Pro správu profilu se prosím{" "}
            <Link href="/login" className="text-[#8B5CF6] font-semibold underline">
              přihlaste
            </Link>
            .
          </div>
        )}

        {/* Generated Token Banner */}
        {generatedToken && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Key className="w-4 h-4" />
              Váš nový autorizovaný API Token byl vygenerován!
            </div>
            <p className="text-xs text-slate-300">
              Zkopírujte si tento token a vložte jej do souboru{" "}
              <code className="text-emerald-300 font-mono bg-[#0E1118] px-1.5 py-0.5 rounded">
                fsd_agent/config.lua
              </code>{" "}
              do proměnné <code className="text-emerald-300">Config.ApiKey</code>.
            </p>

            <div className="flex items-center gap-2 bg-[#08090D] border border-emerald-500/30 p-3 rounded-xl">
              <span className="font-mono text-xs text-emerald-300 break-all flex-1 select-all">
                {generatedToken}
              </span>
              <button
                onClick={() => copyToClipboard(generatedToken)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-xs flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Zkopírováno" : "Kopírovat"}
              </button>
            </div>
          </div>
        )}

        {/* Authorized Agent Setup Section */}
        <div className="bg-[#131722] border border-[#252B3A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#252B3A]">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Autorizovaný FiveM Agent (Vlastník)</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Propojte svůj FiveM server skrze oficiální serverový skript{" "}
                <code className="text-purple-300">fsd_agent</code> a získejte 100% potvrzené reporty
                bez závislosti na veřejných endpointových omezeních.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-3 py-1 rounded bg-[#0E1118] text-slate-400 border border-[#252B3A]">
                Resource v1.0.0
              </span>
            </div>
          </div>

          {/* Form to connect new server */}
          {user && (
            <form onSubmit={handleCreateIntegration} className="space-y-4 max-w-xl">
              <h3 className="text-sm font-semibold text-white">Vytvořit nový autorizační klíč pro server:</h3>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    IP:Port nebo cíl serveru
                  </label>
                  <input
                    type="text"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="185.100.200.45:30120"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1118] border border-[#252B3A] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Název serveru (volitelný)
                  </label>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="Můj Roleplay Server"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1118] border border-[#252B3A] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-semibold text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Vygenerovat API token
              </button>
            </form>
          )}

          {/* List of user integrations */}
          <div className="pt-4">
            <h3 className="text-sm font-semibold text-white mb-3">Vaše aktivní integrace ({integrations.length}):</h3>

            {integrations.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#0E1118] text-center text-xs text-slate-500 border border-[#252B3A]">
                Zatím nemáte vytvořenou žádnou autorizovanou serverovou integraci.
              </div>
            ) : (
              <div className="space-y-3">
                {integrations.map((integ) => (
                  <div
                    key={integ.id}
                    className="p-4 rounded-xl bg-[#0E1118] border border-[#252B3A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            integ.status === "active" ? "bg-emerald-400" : "bg-rose-500"
                          }`}
                        ></span>
                        <strong className="text-white font-semibold">{integ.target.displayName}</strong>
                        <span className="font-mono text-slate-400">({integ.target.normalizedIdentifier})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Vytvořeno: {new Date(integ.createdAt).toLocaleDateString("cs-CZ")} | Stav:{" "}
                        <span className={integ.status === "active" ? "text-emerald-400" : "text-rose-400"}>
                          {integ.status === "active" ? "Aktivní" : "Zneplatněno"}
                        </span>
                      </div>
                    </div>

                    {integ.status === "active" && (
                      <button
                        onClick={() => handleRevoke(integ.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-medium text-xs self-end sm:self-auto transition-colors"
                      >
                        Zneplatnit token
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
