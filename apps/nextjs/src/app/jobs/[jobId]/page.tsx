"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { ArrowLeft, ExternalLink, Briefcase, MapPin, DollarSign, FileText } from "lucide-react";
import { Button } from "@kerjaflow/ui/button";
import { Card } from "@kerjaflow/ui/card";
import { Header } from "../../kerjaflow/_components/header";
import { StatusFooter } from "../../kerjaflow/_components/status-footer";

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const jobId = params.jobId as string;

  // Get user from Convex
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Get job details
  const job = useQuery(
    api.jobs.getJobById,
    jobId ? { jobId: jobId as any } : "skip"
  );

  const handleBack = () => {
    router.push("/results");
  };

  const handleGenerateResume = () => {
    if (job && typeof window !== "undefined") {
      localStorage.setItem("kerjaflow_selected_job", JSON.stringify(job));
    }
    router.push("/generate");
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-8">
      <Header currentView="results" />
      <main className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Results
            </button>
            <div className="flex items-center gap-3">
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-bold transition-all"
              >
                View on Hiredly <ExternalLink size={16} />
              </a>
              <Button
                onClick={handleGenerateResume}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-bold"
              >
                <FileText size={16} className="mr-2" />
                Generate Resume
              </Button>
            </div>
          </div>

          {/* Job Details Card */}
          <Card className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            {/* Title Section */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {job.position}
              </h1>
              <p className="text-xl text-slate-600 font-medium mb-4">{job.company}</p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-slate-600">
                  <MapPin size={18} className="mr-2" />
                  <span>{job.location}</span>
                </div>
                {job.salary && job.salary !== "Not specified" && (
                  <div className="flex items-center text-slate-600">
                    <DollarSign size={18} className="mr-2" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Briefcase size={20} className="mr-2" />
                Job Description
              </h2>
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </div>
          </Card>

          {/* Action Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={handleBack}
              variant="outline"
              className="px-6 py-2.5"
            >
              Back to Results
            </Button>
            <Button
              onClick={handleGenerateResume}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5"
            >
              Generate Tailored Resume
            </Button>
          </div>
        </div>
      </main>
      <StatusFooter />
    </div>
  );
}
