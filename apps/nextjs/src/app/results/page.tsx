"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { ResultsView } from "../kerjaflow/_components/results-view";
import { StatusFooter } from "../kerjaflow/_components/status-footer";
import { Header } from "../kerjaflow/_components/header";
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

  // Get jobs with rankings (reactive query - updates as rankings complete)
  const jobsWithRankings = useQuery(
    api.rankings.getJobsWithRankings,
    convexUser?._id && searchQuery
      ? { userId: convexUser._id, searchTerm: searchQuery }
      : "skip"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSearch = localStorage.getItem("kerjaflow_search");
      if (savedSearch) setSearchQuery(savedSearch);
    }
  }, []);

  // Calculate ranking progress
  const { isRanking, rankingProgress } = useMemo(() => {
    if (!jobsWithRankings || jobsWithRankings.length === 0) {
      return { isRanking: false, rankingProgress: 0 };
    }

    const rankedCount = jobsWithRankings.filter(
      (job) => job.fitScore !== undefined
    ).length;
    const totalCount = jobsWithRankings.length;
    const progress = Math.round((rankedCount / totalCount) * 100);
    const stillRanking = rankedCount < totalCount;

    return { isRanking: stillRanking, rankingProgress: progress };
  }, [jobsWithRankings]);

  const handleJobSelect = (job: RankedJob) => {
    // Navigate to job details page with jobId
    router.push(`/jobs/${job._id}`);
  };

  const handleModifySearch = () => {
    router.push("/search");
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-8">
      <Header currentView="results" />
      <main className="px-6 py-8">
        <ResultsView
          searchQuery={searchQuery}
          userDump={resume?.content || ""}
          jobs={(jobsWithRankings || []) as RankedJob[]}
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
