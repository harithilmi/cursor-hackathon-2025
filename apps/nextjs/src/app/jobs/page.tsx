"use client";

import { useState } from "react";

interface JobListing {
  url: string;
  position: string;
  company: string;
  location: string;
  description: string;
  salary: string;
}

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalFound, setTotalFound] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      });

      if (!response.ok) {
        throw new Error("Failed to search jobs");
      }

      const data = (await response.json()) as {
        jobs: JobListing[];
        totalFound: number;
      };
      setJobs(data.jobs);
      setTotalFound(data.totalFound);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Job Search</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter job title (e.g., software engineer)"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">
            Scraping jobs from Hiredly... This may take a moment.
          </p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <>
          <p className="mb-4 text-gray-600">
            Found {totalFound} job{totalFound !== 1 ? "s" : ""}
          </p>
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md"
              >
                <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                  {job.position}
                </h2>
                <p className="mb-3 text-lg text-gray-700">{job.company}</p>

                <div className="mb-4 flex flex-wrap gap-3">
                  <p className="text-sm text-gray-600">📍 {job.location}</p>
                  <p className="text-sm text-gray-600">
                    💰 {job.salary}
                  </p>
                </div>

                {job.description && (
                  <div className="mb-4">
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Full Job Description:
                    </h3>
                    <div className="max-h-96 overflow-y-auto rounded bg-gray-50 p-4">
                      <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  </div>
                )}

                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  View on Hiredly →
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && jobs.length === 0 && searchTerm && (
        <p className="text-center text-gray-600">
          No jobs found. Try a different search term.
        </p>
      )}
    </div>
  );
}
