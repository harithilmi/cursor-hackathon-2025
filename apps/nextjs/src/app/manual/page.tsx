"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Header } from "../kerjaflow/_components/header";
import { StatusFooter } from "../kerjaflow/_components/status-footer";
import {
  ClipboardPaste,
  Download,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@acme/ui/button";

export default function ManualJobPage() {
  const router = useRouter();
  const { user } = useUser();

  const [jobInput, setJobInput] = useState("");
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

  const handleGenerateResume = async () => {
    if (!jobInput.trim()) {
      setError("Please paste a job description");
      return;
    }

    if (!resume?.content) {
      setError("Please upload your resume first in the Master Dump section");
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
          jobDescription: jobInput,
          jobPosition: "Position from Job Description",
          jobCompany: "Company",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Resume_Custom_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate PDF. Please try again."
      );
    } finally {
      setIsGenerating(false);
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

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col">
      <Header currentView="manual" />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4">
              <Sparkles size={14} />
              <span>Manual Job Entry</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Paste Any Job Description
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto">
              Paste the complete job listing including position, company, and requirements.
              Our AI will extract the details and generate a tailored resume.
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
          <div className="glass-card rounded-2xl p-6">
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
We're looking for a passionate software engineer to join our team...

Requirements:
- 3+ years of experience with React/Next.js
- Strong TypeScript skills
- Experience with cloud services (AWS/GCP)
...`}
              className="w-full h-80 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
              <span className="text-xs text-slate-500">
                {jobInput.length > 0
                  ? `${jobInput.length} characters`
                  : "Tip: Include position, company, location, and requirements"}
              </span>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleGenerateResume}
                disabled={isGenerating || !jobInput.trim() || !resume?.content}
                className="flex-1 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Generating Resume...
                  </>
                ) : (
                  <>
                    <Download size={18} className="mr-2" />
                    Generate Tailored Resume PDF
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Alternative Option */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm mb-3">
              Or search for jobs from Hiredly
            </p>
            <button
              onClick={() => router.push("/search")}
              className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Go to Job Search
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
      <StatusFooter />
    </div>
  );
}
