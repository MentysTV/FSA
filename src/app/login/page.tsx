"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Radar, Lock, Mail, ArrowRight, AlertCircle, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Přihlášení se nezdařilo.");
      } else {
        router.push("/history");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Síťová chyba.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#131722] border border-[#252B3A] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#38BDF8] p-0.5 mx-auto">
              <div className="w-full h-full bg-[#0E1118] rounded-[14px] flex items-center justify-center">
                <Radar className="w-6 h-6 text-[#8B5CF6]" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white">Přihlášení do FSD PRO</h1>
            <p className="text-xs text-slate-400">Přístup k osobní historii, reportům a API tokenům</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email nebo uživatelské jméno
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@fsd.local"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0E1118] border border-[#252B3A] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Heslo</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0E1118] border border-[#252B3A] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-semibold text-xs shadow-lg shadow-[#8B5CF6]/30 transition-all disabled:opacity-50"
            >
              {loading ? "Přihlašuji..." : "Přihlásit se"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Logins Helper */}
          <div className="pt-4 border-t border-[#252B3A] space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Přednastavené testovací účty:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoFill("admin@fsd.local", "AdminFSD2026!")}
                className="p-2 rounded-lg bg-[#0E1118] border border-[#252B3A] text-purple-300 hover:border-purple-500 text-left"
              >
                <div className="font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Administrátor
                </div>
                <div className="text-[10px] text-slate-500 truncate">admin@fsd.local</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("demo@fsd.local", "DemoUser2026!")}
                className="p-2 rounded-lg bg-[#0E1118] border border-[#252B3A] text-[#38BDF8] hover:border-[#38BDF8] text-left"
              >
                <div className="font-bold">Uživatel / Dev</div>
                <div className="text-[10px] text-slate-500 truncate">demo@fsd.local</div>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400">
            Nemáte ještě účet?{" "}
            <Link href="/register" className="text-[#8B5CF6] font-semibold hover:underline">
              Zaregistrujte se zdarma
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
