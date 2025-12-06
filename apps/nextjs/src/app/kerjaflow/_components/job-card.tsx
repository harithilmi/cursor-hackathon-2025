import { AlertTriangle, Briefcase, ChevronRight, Loader2, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@acme/ui/badge";
import type { Job } from "../_lib/mock-data";

interface JobCardProps {
  job: Job;
  fitScore?: number;
  isRanking?: boolean;
  onClick: (job: Job) => void;
}

export function JobCard({ job, fitScore, isRanking = false, onClick }: JobCardProps) {
  const isHighMatch = fitScore && fitScore > 80;
  const isMediumMatch = fitScore && fitScore > 60;

  return (
    <div
      onClick={() => onClick(job)}
      className="group relative bg-slate-900/80 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-brand-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 overflow-hidden backdrop-blur-sm cursor-pointer"
    >
      {/* #region FIT SCORE BADGE */}
      <div className="absolute top-0 right-0 p-4">
        {isRanking ? (
          <div className="flex flex-col items-center">
            <Loader2 size={24} className="text-brand-400 animate-spin" />
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">
              Ranking...
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-lg ${
              isHighMatch
                ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-green-500/20"
                : isMediumMatch
                  ? "bg-brand-500/10 text-brand-400 border-brand-500/20"
                  : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {isHighMatch && <Sparkles className="w-3 h-3" />}
            {fitScore || 0}% Match
          </div>
        )}
      </div>
      {/* #endregion */}

      {/* #region CARD CONTENT */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-slate-400 border border-slate-700">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="pr-12">
            <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
              {job.title || job.position}
            </h3>
            <p className="text-sm text-slate-400">{job.company}</p>
          </div>
        </div>

        {/* Red Flag Warning */}
        {job.risk_level === "High Risk" && (
          <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20 mb-4 w-fit">
            <AlertTriangle className="w-3 h-3" /> Red Flag
          </div>
        )}

        {/* Location & Salary */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-slate-500" />
            {job.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Briefcase className="w-4 h-4 text-slate-500" />
            {job.salary}
          </div>
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {job.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300"
                >
                  {tag}
                </span>
              ))}
              {isHighMatch && (
                <span className="text-[10px] px-2 py-1 bg-brand-500/10 rounded border border-brand-500/20 text-brand-300">
                  High Match
                </span>
              )}
            </div>
          )}
        </div>

        {/* CTA Button */}
        {isHighMatch ? (
          <div className="ai-border-container">
            <div className="ai-border-bg flex items-center justify-center py-2.5 px-4 cursor-pointer hover:bg-slate-700 transition-colors">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                Generate Resume <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ) : (
          <button className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2">
            View Details <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      {/* #endregion */}
    </div>
  );
}
