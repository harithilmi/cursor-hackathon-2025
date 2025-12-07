"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { ResultsView, type RankedJob } from "../../kerjaflow/_components/results-view";
import { StatusFooter } from "../../kerjaflow/_components/status-footer";
import { Header } from "../../kerjaflow/_components/header";
import type { Id } from "~/convex/_generated/dataModel";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();

  // Get search term from URL and decode it
  const searchTerm = decodeURIComponent(params.searchTerm as string);

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
    convexUser?._id && searchTerm
      ? { userId: convexUser._id, searchTerm }
      : "skip"
  );

  // Get saved job IDs
  const savedJobIds = useQuery(
    api.savedJobs.getSavedJobIds,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  // Mutation to toggle save state
  const toggleSaveJob = useMutation(api.savedJobs.toggleSaveJob);

  const handleSaveToggle = async (jobId: string) => {
    if (!convexUser?._id) return;
    await toggleSaveJob({
      userId: convexUser._id,
      jobId: jobId as Id<"jobListings">,
    });
  };

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
          searchQuery={searchTerm}
          userDump={resume?.content || ""}
          jobs={(jobsWithRankings || []) as RankedJob[]}
          isRanking={isRanking}
          rankingProgress={rankingProgress}
          savedJobIds={(savedJobIds || []) as string[]}
          onJobSelect={handleJobSelect}
          onModifySearch={handleModifySearch}
          onSaveToggle={handleSaveToggle}
        />
      </main>
      <StatusFooter />
    </div>
  );
}
