"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ArrowLeft, Shield, Check, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Přístup odepřen nebo chyba načtení.");
        return res.json();
      })
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        alert("Chyba při změně role.");
      }
    } catch {
      alert("Chyba spojení.");
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-black text-white">Správa Uživatelů</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Seznam registrovaných uživatelů a přiřazování systémových rolí.
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400">Načítám uživatele...</div>
        ) : error ? (
          <div className="bg-[#131722] border border-rose-500/30 p-6 rounded-2xl text-rose-300 text-xs">
            {error}
          </div>
        ) : (
          <div className="bg-[#131722] border border-[#252B3A] rounded-2xl overflow-x-auto shadow-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#252B3A] bg-[#0E1118]/80 text-slate-400">
                  <th className="p-4">Uživatel</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Počet skenů</th>
                  <th className="p-4">Registrace</th>
                  <th className="p-4 text-right">Změna role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252B3A]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#161b29]">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
                        {u.username.substring(0, 1).toUpperCase()}
                      </div>
                      {u.username}
                    </td>
                    <td className="p-4 font-mono text-slate-300">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold border ${
                          u.role === "admin"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-slate-700/20 text-slate-300 border-slate-700/30"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{u._count.scans}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString("cs-CZ")}
                    </td>
                    <td className="p-4 text-right">
                      {u.role === "admin" ? (
                        <button
                          onClick={() => handleChangeRole(u.id, "user")}
                          className="px-2.5 py-1 rounded bg-[#0E1118] border border-[#252B3A] hover:border-slate-500 text-slate-300 text-[11px]"
                        >
                          Změnit na User
                        </button>
                      ) : (
                        <button
                          onClick={() => handleChangeRole(u.id, "admin")}
                          className="px-2.5 py-1 rounded bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 text-[11px] font-semibold"
                        >
                          Povýšit na Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
