"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useAction } from "convex/react";
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
      // Error is logged but doesn't block - results appear via Convex reactive query
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

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-400 bg-green-500/20";
    if (score >= 50) return "text-yellow-400 bg-yellow-500/20";
    return "text-red-400 bg-red-500/20";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return "from-green-500/20 to-green-500/5";
    if (score >= 50) return "from-yellow-500/20 to-yellow-500/5";
    return "from-red-500/20 to-red-500/5";
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
              <span>Match Calculator</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Check Your Job Fit
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto">
              Paste any job description to see your match percentage.
              AI extracts position &amp; company and analyzes your fit.
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

About the Role:
We're looking for a passionate software engineer...

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
                Calculate Match Percentage
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Your Matches
              </h2>
              {matches && matches.length > 0 && (
                <span className="text-sm text-slate-400">
                  {matches.length} job{matches.length !== 1 ? "s" : ""} analyzed
                </span>
              )}
            </div>

            {/* Empty State */}
            {(!matches || matches.length === 0) && (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Matches Yet
                </h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Paste a job description above and click &quot;Calculate Match&quot;
                  to see how well you fit the role.
                </p>
              </div>
            )}

            {/* Match Cards */}
            {matches && matches.map((match: Doc<"manualJobMatches">) => (
              <div
                key={match._id}
                className={`glass-card rounded-2xl overflow-hidden bg-gradient-to-r ${getScoreBgColor(match.fitScore)}`}
              >
                {/* Main Row */}
                <div
                  className="p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => setExpandedId(expandedId === match._id ? null : match._id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Score Badge */}
                    <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${getScoreColor(match.fitScore)}`}>
                      <span className="text-2xl font-black">{match.fitScore}</span>
                      <span className="text-[10px] font-medium opacity-80">%</span>
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
                        title="Delete match"
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
                    {/* Penalty Calculation */}
                    {match.penaltyCalculation && (
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                          Score Calculation
                        </h4>
                        <p className="text-sm text-slate-300 font-mono">
                          {match.penaltyCalculation}
                        </p>
                      </div>
                    )}

                    {/* Skills Analysis */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Critical Skills Found */}
                      {match.criticalSkillsFound && match.criticalSkillsFound.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-green-400 mb-2">
                            Critical Skills Matched
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {match.criticalSkillsFound.map((skill: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-md"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Critical Skills Missing */}
                      {match.criticalSkillsMissing && match.criticalSkillsMissing.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-red-400 mb-2">
                            Critical Skills Missing
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {match.criticalSkillsMissing.map((skill: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-md"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Reasoning */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                        <Sparkles size={14} className="text-accent-400" />
                        Analysis Summary
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {match.aiReasoning}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      {match.keyStrengths && match.keyStrengths.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-green-400 mb-2">
                            Key Strengths
                          </h4>
                          <ul className="space-y-1.5">
                            {match.keyStrengths.map((strength: string, idx: number) => (
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

                      {/* Challenges / Red Flags */}
                      {match.potentialChallenges && match.potentialChallenges.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-red-400 mb-2">
                            Red Flags / Gaps
                          </h4>
                          <ul className="space-y-1.5">
                            {match.potentialChallenges.map((challenge: string, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-slate-300"
                              >
                                <span className="text-red-400 mt-0.5">!</span>
                                <span>{challenge}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <StatusFooter />
    </div>
  );
}
