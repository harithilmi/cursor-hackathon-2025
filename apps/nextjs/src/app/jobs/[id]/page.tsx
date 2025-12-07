"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { Header } from "../../kerjaflow/_components/header";
import { StatusFooter } from "../../kerjaflow/_components/status-footer";
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building2,
  Download,
  ExternalLink,
  Loader2,
  MapPin,
  Sparkles,
  Banknote,
} from "lucide-react";
import { Button } from "@acme/ui/button";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const jobId = params.id as string;

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Get job details
  const job = useQuery(
    api.jobs.getJobById,
    jobId ? { jobId: jobId as Id<"jobListings"> } : "skip"
  );

  // Get ranking for job
  const ranking = useQuery(
    api.rankings.getRankingForJob,
    convexUser?._id && jobId
      ? { userId: convexUser._id, jobId: jobId as Id<"jobListings"> }
      : "skip"
  );

  // Check if job is saved
  const isJobSaved = useQuery(
    api.savedJobs.isJobSaved,
    convexUser?._id && jobId
      ? { userId: convexUser._id, jobId: jobId as Id<"jobListings"> }
      : "skip"
  );

  // Toggle save mutation
  const toggleSave = useMutation(api.savedJobs.toggleSaveJob);

  const handleBack = () => {
    router.back();
  };

  const handleSaveToggle = async () => {
    if (!convexUser?._id || !jobId) return;
    await toggleSave({
      userId: convexUser._id,
      jobId: jobId as Id<"jobListings">,
    });
  };

  const handleGenerateResume = async () => {
    if (!job || !resume?.content) {
      setError("Please upload your resume first in the Dump section");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: resume.content,
          jobDescription: job.description || "",
          jobPosition: job.position || "",
          jobCompany: job.company || "",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Resume_${job.company?.replace(/\s+/g, "_") || "Job"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Loading state
  if (job === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col">
        <Header currentView="results" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-400 mx-auto mb-4" />
            <p className="text-slate-400">Loading job details...</p>
          </div>
        </main>
        <StatusFooter />
      </div>
    );
  }

  // Not found state
  if (job === null) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col">
        <Header currentView="results" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 mb-4">Job not found</p>
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-slate-700 text-slate-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go back
            </Button>
          </div>
        </main>
        <StatusFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col">
      <Header currentView="results" />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span>Back to results</span>
          </button>

          {/* Job Header Card */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <Briefcase size={24} className="text-brand-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {job.position}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Building2 size={14} />
                      <span>{job.company}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {job.location && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                      <MapPin size={14} />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.salary && job.salary !== "Not specified" && (
                    <div className="flex items-center gap-1.5 text-sm text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg">
                      <Banknote size={14} />
                      <span>{job.salary}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fit Score */}
              {ranking && (
                <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-brand-500/20 to-accent-500/20 p-4 rounded-xl border border-brand-500/20">
                  <Sparkles size={16} className="text-brand-400" />
                  <span className="text-3xl font-black text-brand-400">
                    {ranking.fitScore}%
                  </span>
                  <span className="text-xs text-slate-400">Match</span>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700/50">
              <Button
                onClick={handleGenerateResume}
                disabled={isGenerating}
                className="bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Download size={16} className="mr-2" />
                )}
                {isGenerating ? "Generating..." : "Generate Resume PDF"}
              </Button>
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-xl font-semibold transition-colors"
              >
                Apply on Hiredly
                <ExternalLink size={14} />
              </a>
              <Button
                onClick={handleSaveToggle}
                variant="outline"
                className={`border-slate-700 ${
                  isJobSaved
                    ? "bg-brand-500/20 text-brand-400 border-brand-500/30"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Bookmark
                  size={16}
                  className={isJobSaved ? "fill-current" : ""}
                />
              </Button>
            </div>
          </div>

          {/* AI Analysis Card */}
          {ranking && (
            <div className="glass-card rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-brand-400" />
                AI Analysis
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                {ranking.aiReasoning}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {ranking.keyStrengths && ranking.keyStrengths.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-400 mb-3">
                      Key Strengths
                    </h3>
                    <ul className="space-y-2">
                      {ranking.keyStrengths.map((strength, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <span className="text-green-400 mt-0.5">+</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {ranking.potentialChallenges &&
                  ranking.potentialChallenges.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-amber-400 mb-3">
                        Areas for Growth
                      </h3>
                      <ul className="space-y-2">
                        {ranking.potentialChallenges.map((challenge, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-slate-300"
                          >
                            <span className="text-amber-400 mt-0.5">!</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Job Description Card */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Job Description
            </h2>
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>
        </div>
      </main>
      <StatusFooter />
    </div>
  );
}
