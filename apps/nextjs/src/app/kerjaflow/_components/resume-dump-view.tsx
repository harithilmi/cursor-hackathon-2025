import { ChevronRight, FileText, UploadCloud } from "lucide-react";
import { Button } from "@acme/ui/button";
import { Textarea } from "@acme/ui/textarea";

interface ResumeDumpViewProps {
  resume: string;
  setResume: (resume: string) => void;
  onNext: () => void;
  isLoading?: boolean;
}

export function ResumeDumpView({
  resume,
  setResume,
  onNext,
  isLoading = false,
}: ResumeDumpViewProps) {
  return (
    <div className="max-w-3xl mx-auto mt-10 animate-in slide-in-from-bottom-4 duration-500 px-4 relative">
      {/* Ambient Effects */}
      <div className="absolute top-[-20%] left-[10%] w-[400px] h-[400px] bg-brand-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* #region HEADER */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center">
          <FileText className="text-brand-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            Step 1: The &quot;Master Dump&quot;
          </h2>
          <p className="text-slate-400 text-sm">
            Paste your <strong className="text-slate-300">entire</strong> career history here. We use this
            &quot;Master Data&quot; to generate specific, tailored PDFs for each job
            application.
          </p>
        </div>
      </div>
      {/* #endregion */}

      {/* #region CARD */}
      <div className="glass-card p-6 rounded-2xl relative z-10">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-slate-300">
            Raw Experience Data
          </label>
          <button className="text-brand-400 text-xs font-bold flex items-center gap-1 hover:text-brand-300 transition-colors">
            <UploadCloud size={14} /> Upload Existing PDF
          </button>
        </div>

        <div className="relative">
          <Textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full h-80 p-4 rounded-xl border border-slate-700 bg-slate-900/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none font-mono text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 resize-none"
            placeholder="I worked at Company A doing X, Y, Z. I know React, Python. I like badminton..."
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-slate-800/90 px-2 py-1 rounded border border-slate-700">
            {resume.length} chars
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={onNext}
            className="text-slate-500 text-sm hover:text-slate-300 font-medium transition-colors"
          >
            Skip for now
          </button>
          <Button
            onClick={onNext}
            disabled={resume.length < 20 || isLoading}
            className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save to Profile"} <ChevronRight size={20} />
          </Button>
        </div>
      </div>
      {/* #endregion */}
    </div>
  );
}
