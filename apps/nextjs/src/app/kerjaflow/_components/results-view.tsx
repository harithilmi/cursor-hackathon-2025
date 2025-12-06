import { Loader2 } from "lucide-react";
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
  userDump,
  jobs,
  isRanking,
  rankingProgress,
  onJobSelect,
  onModifySearch,
}: ResultsViewProps) {
  if (isRanking) {
    return (
      <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <Loader2 size={48} className="text-indigo-600 animate-spin" />
          <h2 className="text-2xl font-bold text-slate-900">
            AI is ranking your jobs...
          </h2>
          <p className="text-slate-500 text-center max-w-md">
            Claude is analyzing each job description against your resume to find the best matches
          </p>
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${rankingProgress}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 text-center">
              Ranking progress: {rankingProgress}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            No jobs found
          </h2>
          <p className="text-slate-500 text-center max-w-md">
            Try a different search term or wait for the job scraping to complete
          </p>
          <button
            onClick={onModifySearch}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 underline"
          >
            Modify Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Matches for &quot;{searchQuery || "Software Engineer"}&quot;
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Found {jobs.length} jobs. Ranked by AI fit with your master resume.
          </p>
        </div>
        <button
          onClick={onModifySearch}
          className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
        >
          Modify Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            fitScore={job.fitScore || 0}
            onClick={() => onJobSelect(job)}
          />
        ))}
      </div>
    </div>
  );
}
