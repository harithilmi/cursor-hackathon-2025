"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { GeneratorView } from "../kerjaflow/_components/generator-view";
import { StatusFooter } from "../kerjaflow/_components/status-footer";

export default function GeneratePage() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [userDump, setUserDump] = useState("");

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedJob = localStorage.getItem("kerjaflow_selected_job");

      if (savedJob) {
        setSelectedJob(JSON.parse(savedJob));
      }
    }
  }, []);

  // Update userDump from Convex resume
  useEffect(() => {
    if (resume?.content) {
      setUserDump(resume.content);
    }
  }, [resume]);

  const handleBack = () => {
    router.push("/results");
  };

  if (!selectedJob || !userDump) {
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
      <main className="px-6 py-8">
        <GeneratorView
          job={selectedJob}
          userDump={userDump}
          onBack={handleBack}
          userId={convexUser?._id}
        />
      </main>
      <StatusFooter />
    </div>
  );
}
