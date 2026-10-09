"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Radar,
  Server,
  Layers,
  History,
  GitCompare,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/scanner", label: "Skener", icon: Radar },
    { href: "/servers", label: "Servery", icon: Server },
    { href: "/resources", label: "Katalog", icon: Layers },
    { href: "/compare", label: "Porovnání", icon: GitCompare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#252B3A] bg-[#08090D]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#38BDF8] p-0.5 flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20 group-hover:shadow-[#8B5CF6]/40 transition-all">
            <div className="w-full h-full bg-[#0E1118] rounded-[10px] flex items-center justify-center">
              <Radar className="w-5 h-5 text-[#8B5CF6] group-hover:rotate-45 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white">FSD</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-[#94A3B8] -mt-1 hidden sm:inline">FiveM Script Detector</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#131722] text-[#8B5CF6] border border-[#252B3A]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#131722]/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile / Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#252B3A] bg-[#131722] hover:bg-[#171d2b] transition-colors text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center text-xs text-[#8B5CF6] font-bold">
                  {user.username.substring(0, 1).toUpperCase()}
                </div>
                <span className="font-medium text-slate-200">{user.username}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-52 rounded-xl bg-[#131722] border border-[#252B3A] shadow-xl py-2 z-50 text-sm"
                >
                  <div className="px-4 py-2 border-b border-[#252B3A]">
                    <div className="font-semibold text-white">{user.username}</div>
                    <div className="text-xs text-[#94A3B8] truncate">{user.email}</div>
                  </div>
                  <Link
                    href="/history"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-[#1e2333] hover:text-white"
                  >
                    <History className="w-4 h-4 text-[#8B5CF6]" />
                    Moje historie skenů
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-[#1e2333] hover:text-white"
                  >
                    <User className="w-4 h-4 text-[#38BDF8]" />
                    Nastavení účtu & API
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-purple-300 hover:bg-[#1e2333]"
                    >
                      <Shield className="w-4 h-4 text-purple-400" />
                      Administrace
                    </Link>
                  )}
                  <div className="my-1 border-t border-[#252B3A]"></div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-[#1e2333]"
                  >
                    <LogOut className="w-4 h-4" />
                    Odhlásit se
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Přihlášení
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-medium rounded-lg bg-[#8B5CF6] hover:bg-[#7c3aed] text-white shadow-md shadow-[#8B5CF6]/20 transition-all"
              >
                Registrace
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#131722]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#252B3A] bg-[#0E1118] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:bg-[#131722]"
              >
                <Icon className="w-5 h-5 text-[#8B5CF6]" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-[#252B3A]">
            {user ? (
              <div className="space-y-2">
                <div className="text-sm text-slate-400 px-3">
                  Přihlášen jako <strong className="text-white">{user.username}</strong>
                </div>
                <Link
                  href="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-300 hover:bg-[#131722] rounded-lg"
                >
                  Moje historie skenů
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-300 hover:bg-[#131722] rounded-lg"
                >
                  Nastavení účtu & API
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-purple-400 hover:bg-[#131722] rounded-lg"
                  >
                    Administrace
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-[#131722] rounded-lg"
                >
                  Odhlásit se
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center rounded-lg border border-[#252B3A] text-slate-300 font-medium"
                >
                  Přihlášení
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center rounded-lg bg-[#8B5CF6] text-white font-medium"
                >
                  Vytvořit účet zdarma
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
