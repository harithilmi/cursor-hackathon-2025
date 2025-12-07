"use client";

import { useRouter } from "next/navigation";
import { Briefcase, FileText, Bell, ClipboardPaste } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface HeaderProps {
  currentView: "dump" | "search" | "results" | "generate" | "manual";
}

export function Header({ currentView }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="h-20 px-6 flex items-center justify-between z-50 sticky top-0 glass-panel">
      {/* #region LOGO */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => router.push("/search")}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-xl tracking-tight text-white">
            Kerja<span className="text-brand-400">Flow</span>
          </span>
          <span className="block text-[10px] text-slate-400 font-mono tracking-widest uppercase">
            Beta v0.9
          </span>
        </div>
      </div>
      {/* #endregion */}

      {/* #region STATUS INDICATORS */}
      <div className="hidden md:flex items-center text-slate-400 text-sm gap-2">
        {currentView === "results" && (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>
              Apify Scraper: <span className="text-green-400">Ready</span>
            </span>
            <span className="mx-2 text-slate-700">|</span>
          </>
        )}
        <span>
          AI Engine: <span className="text-brand-400">Active</span>
        </span>
      </div>
      {/* #endregion */}

      {/* #region RIGHT ACTIONS */}
      <div className="flex items-center gap-4">
        {currentView !== "manual" && (
          <button
            onClick={() => router.push("/manual")}
            className="text-xs font-bold text-slate-400 hover:text-accent-400 flex items-center gap-1.5 uppercase tracking-wide transition-colors"
          >
            <ClipboardPaste size={14} /> Paste Job
          </button>
        )}
        {currentView !== "generate" && currentView !== "dump" && currentView !== "manual" && (
          <button
            onClick={() => router.push("/dump")}
            className="text-xs font-bold text-slate-400 hover:text-brand-400 flex items-center gap-1.5 uppercase tracking-wide transition-colors"
          >
            <FileText size={14} /> Master Dump
          </button>
        )}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950" />
        </button>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 ring-2 ring-slate-700",
            },
          }}
        />
      </div>
      {/* #endregion */}
    </header>
  );
}
