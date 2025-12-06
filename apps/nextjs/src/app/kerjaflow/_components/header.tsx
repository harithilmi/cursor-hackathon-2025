"use client";

import { useRouter } from "next/navigation";
import { Briefcase, FileText } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

interface HeaderProps {
  currentView: "dump" | "search" | "results" | "generate";
}

export function Header({ currentView }: HeaderProps) {
  const router = useRouter();
  const { user } = useUser();

  return (
    <header className="bg-white border-b border-slate-200 py-3 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="flex items-center gap-2 text-indigo-700 font-extrabold text-xl tracking-tight cursor-pointer select-none"
          onClick={() => router.push("/search")}
        >
          <Briefcase className="stroke-[3px]" /> KerjaFlow
        </div>

        <div className="flex items-center gap-6">
          {currentView === "results" && (
            <div className="hidden md:flex items-center text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Hiredly Scraper Active
            </div>
          )}

          <div className="flex items-center gap-3">
            {currentView !== "generate" && currentView !== "dump" && (
              <button
                onClick={() => router.push("/dump")}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-wide"
              >
                <FileText size={14} /> Master Dump
              </button>
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
