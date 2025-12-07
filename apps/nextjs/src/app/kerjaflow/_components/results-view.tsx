import { useState } from "react";
import { Loader2, LayoutGrid, List, Bookmark } from "lucide-react";
import { JobCard } from "./job-card";

export interface RankedJob {
  _id: string;
  position: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  fitScore?: number;
  aiReasoning?: string;
  keyStrengths?: string[];
  potentialChallenges?: string[];
}

type FilterMode = "all" | "saved";

interface ResultsViewProps {
  searchQuery: string;
  userDump: string;
  jobs: RankedJob[];
  isRanking: boolean;
  rankingProgress: number;
  savedJobIds: string[];
  onJobSelect: (job: RankedJob) => void;
  onModifySearch: () => void;
  onSaveToggle: (jobId: string) => void;
}

export function ResultsView({
  searchQuery,
  jobs,
  isRanking,
  rankingProgress,
  savedJobIds,
  onJobSelect,
  onModifySearch,
  onSaveToggle,
}: ResultsViewProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const filteredJobs = filterMode === "saved"
    ? jobs.filter((job) => savedJobIds.includes(job._id))
    : jobs;

  const savedCount = jobs.filter((job) => savedJobIds.includes(job._id)).length;
  /* #region LOADING STATE */
  if (jobs.length === 0 && isRanking) {
    return (
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <Loader2 size={48} className="text-brand-400 animate-spin" />
          <h2 className="text-2xl font-bold text-white">Loading jobs...</h2>
          <p className="text-slate-400 text-center max-w-md">
            Fetching your job listings
          </p>
        </div>
      </div>
    );
  }
  /* #endregion */

  /* #region EMPTY STATE */
  if (jobs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <h2 className="text-2xl font-bold text-white">No jobs found</h2>
          <p className="text-slate-400 text-center max-w-md">
            Try a different search term or wait for the job scraping to complete
          </p>
          <button
            onClick={onModifySearch}
            className="text-sm font-bold text-brand-400 hover:text-brand-300 underline"
          >
            Modify Search
          </button>
        </div>
      </div>
    );
  }
  /* #endregion */

  /* #region RESULTS VIEW */
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 relative">
      {/* Ambient Effects */}
      <div className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] bg-brand-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            Top Matches
            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">
              {jobs.length} Found
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isRanking
              ? "AI ranking in progress..."
              : "Ranked by AI fit with your master resume."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Filter Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                filterMode === "all"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setFilterMode("saved")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
                filterMode === "saved"
                  ? "bg-brand-500/20 text-brand-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Bookmark className="w-3 h-3" />
              Saved
              {savedCount > 0 && (
                <span className="bg-brand-500/30 text-brand-300 text-[10px] px-1.5 py-0.5 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={onModifySearch}
            className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
          >
            Modify Search
          </button>
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button className="p-1.5 bg-slate-700 text-white rounded shadow-sm">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-500 hover:text-slate-300">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ranking Progress */}
      {isRanking && (
        <div className="glass-card p-4 rounded-xl mb-6 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">
              AI Ranking Progress
            </p>
            <p className="text-sm font-bold text-brand-400">{rankingProgress}%</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-accent-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${rankingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty Saved State */}
      {filterMode === "saved" && filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Saved Jobs</h3>
          <p className="text-slate-400 text-sm max-w-sm">
            Click the bookmark icon on any job card to save it for later
          </p>
          <button
            onClick={() => setFilterMode("all")}
            className="mt-4 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
          >
            View All Jobs
          </button>
        </div>
      )}

      {/* Job Grid */}
      {filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 relative z-10">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={{
                id: job._id,
                title: job.position,
                company: job.company,
                location: job.location,
                description: job.description,
                salary: job.salary || "Not specified",
                link: job.url,
                tags: [],
                keywords: [],
                culture_raw: "",
                red_flags: [],
                risk_level: "Safe" as const,
              }}
              fitScore={job.fitScore}
              isRanking={job.fitScore === undefined}
              isSaved={savedJobIds.includes(job._id)}
              onSaveToggle={() => onSaveToggle(job._id)}
              onClick={() => onJobSelect(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
  /* #endregion */
}
