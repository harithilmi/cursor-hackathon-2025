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
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-6 border-b-2 border-foreground pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Results for &quot;{searchQuery || "Software Engineer"}&quot;
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {MOCK_JOBS.length} jobs ranked by fit score
          </p>
        </div>
        <button
          onClick={onModifySearch}
          className="text-sm font-medium text-accent hover:text-foreground transition-colors"
        >
          Modify Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
