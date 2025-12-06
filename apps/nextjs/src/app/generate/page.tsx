"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GeneratorView } from "../kerjaflow/_components/generator-view";
import { StatusFooter } from "../kerjaflow/_components/status-footer";
import { MOCK_USER_DUMP_DEFAULT, MOCK_JOBS, type Job } from "../kerjaflow/_lib/mock-data";

export default function GeneratePage() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [userDump, setUserDump] = useState(MOCK_USER_DUMP_DEFAULT);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedJob = localStorage.getItem("kerjaflow_selected_job");
      const savedResume = localStorage.getItem("kerjaflow_resume");

      if (savedJob) {
        setSelectedJob(JSON.parse(savedJob));
      } else {
        // Fallback to first job if none selected
        setSelectedJob(MOCK_JOBS[0] || null);
      }

      if (savedResume) {
        setUserDump(savedResume);
      }
    }
  }, []);

  const handleBack = () => {
    router.push("/results");
  };

  if (!selectedJob) {
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
        <GeneratorView job={selectedJob} userDump={userDump} onBack={handleBack} />
      </main>
      <StatusFooter />
    </div>
  );
}
