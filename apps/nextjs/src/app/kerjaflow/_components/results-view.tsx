import { Loader2, LayoutGrid, List } from "lucide-react";
import { JobCard } from "./job-card";

interface RankedJob {
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

interface ResultsViewProps {
  searchQuery: string;
  userDump: string;
  jobs: RankedJob[];
  isRanking: boolean;
  rankingProgress: number;
  onJobSelect: (job: any) => void;
  onModifySearch: () => void;
}

export function ResultsView({
  searchQuery,
  jobs,
  isRanking,
  rankingProgress,
  onJobSelect,
  onModifySearch,
}: ResultsViewProps) {
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

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 relative z-10">
        {jobs.map((job) => (
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
            onClick={() => onJobSelect(job)}
          />
        ))}
      </div>
    </div>
  );
  /* #endregion */
}
