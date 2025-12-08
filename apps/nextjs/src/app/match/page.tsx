"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id, Doc } from "~/convex/_generated/dataModel";
import { Header } from "../kerjaflow/_components/header";
import { StatusFooter } from "../kerjaflow/_components/status-footer";
import {
  ClipboardPaste,
  Calculator,
  Sparkles,
  Trash2,
  ChevronDown,
  ChevronUp,
  Building2,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Target,
} from "lucide-react";
import { Button } from "@acme/ui/button";

export default function MatchPage() {
  const router = useRouter();
  const { user } = useUser();

  const [jobInput, setJobInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  // Get user's saved matches
  const matches = useQuery(
    api.manualMatches.getUserMatches,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  // Actions and mutations
  const calculateMatch = useAction(api.manualMatches.calculateMatch);
  const deleteMatch = useMutation(api.manualMatches.deleteMatch);

  const handleCalculateMatch = () => {
    if (!jobInput.trim()) {
      setError("Please paste a job description");
      return;
    }

    if (!resume?.content) {
      setError("Please upload your resume first in the Master Dump section");
      return;
    }

    if (!convexUser?._id) {
      setError("Please sign in to calculate match");
      return;
    }

    setError(null);
    const inputToSubmit = jobInput;
    setJobInput(""); // Clear immediately

    // Fire and forget - don't block UI, allows concurrent submissions
    calculateMatch({
      userId: convexUser._id,
      rawInput: inputToSubmit,
      resumeContent: resume.content,
    }).catch((err) => {
      console.error("Error calculating match:", err);
    });
  };

  const handleDelete = async (matchId: Id<"manualJobMatches">) => {
    try {
      await deleteMatch({ matchId });
    } catch (err) {
      console.error("Error deleting match:", err);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobInput(text);
    } catch {
      setError("Unable to access clipboard. Please paste manually.");
    }
  };

  const getOutcomeStyles = (outcome: "MATCH" | "STRETCH" | "REJECT") => {
    switch (outcome) {
      case "MATCH":
        return {
          badge: "bg-green-500/20 text-green-400 border-green-500/30",
          card: "from-green-500/10 to-green-500/5",
          icon: CheckCircle2,
        };
      case "STRETCH":
        return {
          badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          card: "from-yellow-500/10 to-yellow-500/5",
          icon: Target,
        };
      case "REJECT":
        return {
          badge: "bg-red-500/20 text-red-400 border-red-500/30",
          card: "from-red-500/10 to-red-500/5",
          icon: XCircle,
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col">
      <Header currentView="match" />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-4">
              <Calculator size={14} />
              <span>Interview Probability Calculator</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Should You Apply?
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto">
              Paste a job description to get a brutally honest assessment.
              Only apply to jobs where you have {">"} 70% interview chance.
            </p>
          </div>

          {/* Resume Status */}
          {!resume?.content && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-400 text-sm text-center">
                You haven&apos;t uploaded your resume yet.{" "}
                <button
                  onClick={() => router.push("/dump")}
                  className="underline hover:text-amber-300"
                >
                  Go to Master Dump
                </button>{" "}
                to add your information first.
              </p>
            </div>
          )}

          {/* Input Card */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-slate-300">
                Job Description
              </label>
              <Button
                onClick={handlePaste}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <ClipboardPaste size={14} className="mr-1.5" />
                Paste from Clipboard
              </Button>
            </div>

            <textarea
              value={jobInput}
              onChange={(e) => setJobInput(e.target.value)}
              placeholder={`Paste the full job posting here, for example:

Software Engineer at TechCorp Malaysia
Location: Kuala Lumpur
Salary: RM 8,000 - RM 12,000

Requirements:
- 3+ years of experience with React/Next.js
- Strong TypeScript skills
...`}
              className="w-full h-48 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all"
            />

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Calculate Button */}
            <div className="mt-4">
              <Button
                onClick={handleCalculateMatch}
                disabled={!jobInput.trim() || !resume?.content}
                className="w-full bg-gradient-to-r from-accent-600 to-brand-600 hover:from-accent-500 hover:to-brand-500 text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={18} className="mr-2" />
                Analyze Interview Probability
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Your Analyses
              </h2>
              {matches && matches.filter((m) => m.outcome).length > 0 && (
                <span className="text-sm text-slate-400">
                  {matches.filter((m) => m.outcome).length} job{matches.filter((m) => m.outcome).length !== 1 ? "s" : ""} analyzed
                </span>
              )}
            </div>

            {/* Empty State */}
            {(!matches || matches.filter((m) => m.outcome).length === 0) && (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Analyses Yet
                </h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Paste a job description above to get a brutally honest
                  assessment of your interview chances.
                </p>
              </div>
            )}

            {/* Match Cards */}
            {matches && matches
              .filter((match): match is Doc<"manualJobMatches"> & { outcome: "MATCH" | "STRETCH" | "REJECT" } => !!match.outcome)
              .map((match) => {
              const styles = getOutcomeStyles(match.outcome);
              const OutcomeIcon = styles.icon;

              return (
                <div
                  key={match._id}
                  className={`glass-card rounded-2xl overflow-hidden bg-gradient-to-r ${styles.card}`}
                >
                  {/* Main Row */}
                  <div
                    className="p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                    onClick={() => setExpandedId(expandedId === match._id ? null : match._id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Outcome Badge */}
                      <div className={`px-3 py-2 rounded-lg border ${styles.badge} flex items-center gap-2`}>
                        <OutcomeIcon size={18} />
                        <div className="text-center">
                          <span className="text-sm font-bold block">{match.outcome}</span>
                          <span className="text-xs opacity-80">{match.interviewProbability}%</span>
                        </div>
                      </div>

                      {/* Job Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase size={14} className="text-slate-400" />
                          <span className="font-semibold text-white truncate">
                            {match.position}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-400 truncate">
                            {match.company}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(match._id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete analysis"
                        >
                          <Trash2 size={16} />
                        </button>
                        {expandedId === match._id ? (
                          <ChevronUp size={20} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={20} className="text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === match._id && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 space-y-4">
                      {/* Failed Hard Requirements */}
                      {!match.hardRequirementsPassed && match.failedCriteria && match.failedCriteria.length > 0 && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Failed Hard Requirements
                          </h4>
                          <ul className="space-y-2">
                            {match.failedCriteria.map((criteria, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-red-300"
                              >
                                <XCircle size={14} className="mt-0.5 shrink-0" />
                                <span>{criteria}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Score Breakdown */}
                      {match.hardRequirementsPassed && match.scores && (
                        <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                          <h4 className="text-sm font-semibold text-slate-300 mb-3">
                            Score Breakdown
                          </h4>
                          <div className="space-y-3">
                            {/* Hard Skills */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 w-24">Skills</span>
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${(match.scores.hardSkillsSum / 50) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono text-slate-300 w-12 text-right">
                                {match.scores.hardSkillsSum}/50
                              </span>
                            </div>

                            {/* Experience Penalty */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 w-24">Experience</span>
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${match.scores.experiencePenalty === 0 ? "bg-green-500" : "bg-red-500"}`}
                                  style={{ width: `${((30 + match.scores.experiencePenalty) / 30) * 100}%` }}
                                />
                              </div>
                              <span className={`text-xs font-mono w-12 text-right ${match.scores.experiencePenalty === 0 ? "text-green-400" : "text-red-400"}`}>
                                {match.scores.experiencePenalty}
                              </span>
                            </div>

                            {/* Domain Penalty */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 w-24">Domain</span>
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${match.scores.domainPenalty === 0 ? "bg-green-500" : "bg-orange-500"}`}
                                  style={{ width: `${((20 + match.scores.domainPenalty) / 20) * 100}%` }}
                                />
                              </div>
                              <span className={`text-xs font-mono w-12 text-right ${match.scores.domainPenalty === 0 ? "text-green-400" : "text-orange-400"}`}>
                                {match.scores.domainPenalty}
                              </span>
                            </div>

                            {/* Metrics Bonus */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 w-24">Metrics</span>
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${(match.scores.metricsBonus / 20) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono text-emerald-400 w-12 text-right">
                                +{match.scores.metricsBonus}
                              </span>
                            </div>

                            {/* Tech Stack Bonus */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 w-24">Tech Bonus</span>
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{ width: `${(match.scores.techStackBonus / 10) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono text-purple-400 w-12 text-right">
                                +{match.scores.techStackBonus}
                              </span>
                            </div>

                            {/* Total */}
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-700">
                              <span className="text-xs font-semibold text-white w-24">TOTAL</span>
                              <div className="flex-1" />
                              <span className="text-sm font-bold text-white">
                                {match.interviewProbability}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Passed indicator for non-score view */}
                      {match.hardRequirementsPassed && !match.scores && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-green-400" />
                          <span className="text-sm text-green-400">All hard requirements passed</span>
                        </div>
                      )}

                      {/* Resume Gaps */}
                      {match.resumeGaps && match.resumeGaps.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-3">
                            Resume Gaps to Fix
                          </h4>
                          <div className="space-y-2">
                            {match.resumeGaps.map((gap, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-white text-sm">
                                    {gap.skill}
                                  </span>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    gap.severity === "CRITICAL"
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-yellow-500/20 text-yellow-400"
                                  }`}>
                                    {gap.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-400">
                                  {gap.fixStrategy}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Verdict */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                          <Sparkles size={14} className="text-accent-400" />
                          Verdict
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {match.verdictReasoning}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <StatusFooter />
    </div>
  );
}
