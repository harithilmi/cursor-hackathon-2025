"use client";

import { useRouter } from "next/navigation";
import { Briefcase, FileText, Bell, ClipboardPaste, Percent, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface HeaderProps {
  currentView: "dump" | "search" | "results" | "generate" | "manual" | "match";
}

const navItems = [
  { id: "search", label: "Search", icon: Search, href: "/search" },
  { id: "dump", label: "Resume", icon: FileText, href: "/dump" },
  { id: "match", label: "Match %", icon: Percent, href: "/match" },
  { id: "manual", label: "Generate", icon: ClipboardPaste, href: "/manual" },
] as const;

export function Header({ currentView }: HeaderProps) {
  const router = useRouter();

  const isActive = (id: string) => {
    if (id === "search" && (currentView === "search" || currentView === "results")) return true;
    return currentView === id;
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between z-50 sticky top-0 glass-panel">
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => router.push("/search")}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
          <Briefcase className="w-4 h-4" />
        </div>
        <div className="hidden sm:block">
          <span className="font-bold text-lg tracking-tight text-white">
            Kerja<span className="text-brand-400">Flow</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors ${
                active
                  ? "bg-brand-500/20 text-brand-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Icon size={14} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950" />
        </button>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 ring-2 ring-slate-700",
            },
          }}
        />
      </div>
    </header>
  );
}
