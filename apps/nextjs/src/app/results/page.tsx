"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { ResultsView } from "../kerjaflow/_components/results-view";
import { StatusFooter } from "../kerjaflow/_components/status-footer";
import { Header } from "../kerjaflow/_components/header";
import { MOCK_USER_DUMP_DEFAULT } from "../kerjaflow/_lib/mock-data";
import type { Id } from "~/convex/_generated/dataModel";

interface RankedJob {
  _id: Id<"jobListings">;
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

export default function ResultsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [userDump, setUserDump] = useState(MOCK_USER_DUMP_DEFAULT);
  const [rankedJobs, setRankedJobs] = useState<RankedJob[]>([]);
  const [isRanking, setIsRanking] = useState(false);
  const [rankingProgress, setRankingProgress] = useState(0);

  const saveRanking = useMutation(api.rankings.saveRanking);

  // Get user from Convex
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Get user's resume
  const resume = useQuery(
    api.resumes.getUserResume,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  // Get jobs for the current search
  const jobs = useQuery(
    api.jobs.getUserJobsBySearch,
    convexUser?._id && searchQuery
      ? { userId: convexUser._id, searchTerm: searchQuery }
      : "skip"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSearch = localStorage.getItem("kerjaflow_search");
      const savedResume = localStorage.getItem("kerjaflow_resume");
      if (savedSearch) setSearchQuery(savedSearch);
      if (savedResume) setUserDump(savedResume);
    }
  }, []);

  // Update userDump from Convex resume
  useEffect(() => {
    if (resume?.content) {
      setUserDump(resume.content);
    }
  }, [resume]);

  // Rank jobs when they are loaded
  useEffect(() => {
    if (jobs && jobs.length > 0 && !isRanking && rankedJobs.length === 0) {
      rankJobs();
    }
  }, [jobs]);

  const rankJobs = async () => {
    if (!jobs || jobs.length === 0 || !convexUser) return;

    setIsRanking(true);
    setRankingProgress(0);

    const ranked: RankedJob[] = [];

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      try {
        // Call rank-job API
        const response = await fetch("/api/rank-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeContent: userDump,
            jobDescription: job.description,
            jobPosition: job.position,
            jobCompany: job.company,
          }),
        });

        if (response.ok) {
          const ranking = await response.json();

          // Save ranking to Convex
          await saveRanking({
            userId: convexUser._id,
            jobId: job._id,
            fitScore: ranking.fitScore,
            aiReasoning: ranking.reasoning,
          });

          ranked.push({
            ...job,
            fitScore: ranking.fitScore,
            aiReasoning: ranking.reasoning,
            keyStrengths: ranking.keyStrengths,
            potentialChallenges: ranking.potentialChallenges,
          });
        } else {
          // If ranking fails, add job without ranking
          ranked.push({
            ...job,
            fitScore: 0,
            aiReasoning: "Failed to rank this job",
          });
        }
      } catch (error) {
        console.error("Failed to rank job:", error);
        ranked.push({
          ...job,
          fitScore: 0,
          aiReasoning: "Failed to rank this job",
        });
      }

      setRankingProgress(Math.round(((i + 1) / jobs.length) * 100));
    }

    // Sort by fit score
    ranked.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
    setRankedJobs(ranked);
    setIsRanking(false);
  };

  const handleJobSelect = (job: RankedJob) => {
    // Navigate to job details page with jobId
    router.push(`/jobs/${job._id}`);
  };

  const handleModifySearch = () => {
    router.push("/search");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-8">
      <Header currentView="results" />
      <main className="px-6 py-8">
        <ResultsView
          searchQuery={searchQuery}
          userDump={userDump}
          jobs={rankedJobs}
          isRanking={isRanking}
          rankingProgress={rankingProgress}
          onJobSelect={handleJobSelect}
          onModifySearch={handleModifySearch}
        />
      </main>
      <StatusFooter />
    </div>
  );
}
