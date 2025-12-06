import { Cpu, Database, Sparkles } from "lucide-react";

export function StatusFooter() {
  return (
    <div className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-sm text-slate-500 text-[10px] py-2 px-4 flex justify-between items-center z-50 border-t border-slate-800/50 font-mono">
      <div className="flex gap-4">
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Next.js v16
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
          Convex DB
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          Apify Scraper
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-brand-400">
        <Sparkles size={10} />
        Claude 4.5 Sonnet
      </div>
    </div>
  );
}
