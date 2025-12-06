"use client";

import { useRouter } from "next/navigation";
import { FileText, Terminal } from "lucide-react";

interface HeaderProps {
  currentView: "dump" | "search" | "results" | "generate";
}

export function Header({ currentView }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-background border-b-2 border-foreground py-3 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="flex items-center gap-2 text-foreground font-bold text-lg cursor-pointer select-none hover:text-accent transition-colors"
          onClick={() => router.push("/search")}
        >
          <Terminal className="size-5" strokeWidth={2.5} /> KerjaFlow
        </div>

        <div className="flex items-center gap-6">
          {currentView === "results" && (
            <div className="hidden md:flex items-center text-xs text-muted-foreground border border-foreground px-3 py-1">
              <span className="w-2 h-2 bg-accent mr-2"></span>
              Scraper Active
            </div>
          )}

          <div className="flex items-center gap-4">
            {currentView !== "generate" && currentView !== "dump" && (
              <button
                onClick={() => router.push("/dump")}
                className="text-xs font-medium text-muted-foreground hover:text-accent flex items-center gap-1.5 transition-colors"
              >
                <FileText size={14} /> Master Dump
              </button>
            )}
            <div className="w-8 h-8 border-2 border-foreground bg-foreground text-background flex items-center justify-center text-xs font-bold">
              D
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
