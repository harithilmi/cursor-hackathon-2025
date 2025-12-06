import { Cpu } from "lucide-react";

export function StatusFooter() {
  return (
    <div className="fixed bottom-0 w-full bg-foreground text-background text-[10px] py-1.5 px-4 flex justify-between items-center z-50">
      <div className="flex gap-6">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-accent"></span> Next.js
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-accent"></span> Convex
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-accent"></span> Apify
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Cpu size={10} /> Claude 3.5 Sonnet
      </div>
    </div>
  );
}
