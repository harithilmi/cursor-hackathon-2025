import { MOCK_JOBS, calculateFit, type Job } from "../_lib/mock-data";
import { JobCard } from "./job-card";

interface ResultsViewProps {
  searchQuery: string;
  userDump: string;
  onJobSelect: (job: Job) => void;
  onModifySearch: () => void;
}

export function ResultsView({
  searchQuery,
  userDump,
  onJobSelect,
  onModifySearch,
}: ResultsViewProps) {
  const jobsWithFit = MOCK_JOBS.map((job) => ({
    ...job,
    fit: calculateFit(job.keywords, userDump),
  })).sort((a, b) => b.fit - a.fit);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Matches for &quot;{searchQuery || "Software Engineer"}&quot;
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Found {MOCK_JOBS.length} jobs. Ranked by fit with your master
            resume.
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
        {jobsWithFit.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            fitScore={job.fit}
            onClick={onJobSelect}
          />
        ))}
      </div>
    </div>
  );
}
