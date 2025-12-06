import { Cpu, Database } from "lucide-react";

export function StatusFooter() {
  return (
    <div className="fixed bottom-0 w-full bg-slate-900 text-slate-400 text-[10px] py-1 px-4 flex justify-between items-center z-50 border-t border-slate-800 font-mono">
      <div className="flex gap-4">
        <span className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Next.js
          v14
        </span>
        <span className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> Convex
          DB
        </span>
        <span className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Apify
          Scraper
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Cpu size={10} /> Claude 3.5 Sonnet (Optimized)
      </div>
    </div>
  );
}
