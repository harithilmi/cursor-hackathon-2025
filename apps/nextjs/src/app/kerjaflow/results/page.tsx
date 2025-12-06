"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResultsView } from "../_components/results-view";
import { StatusFooter } from "../_components/status-footer";
import { Header } from "../_components/header";
import { MOCK_USER_DUMP_DEFAULT, type Job } from "../_lib/mock-data";

export default function ResultsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [userDump, setUserDump] = useState(MOCK_USER_DUMP_DEFAULT);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSearch = localStorage.getItem("kerjaflow_search");
      const savedResume = localStorage.getItem("kerjaflow_resume");
      if (savedSearch) setSearchQuery(savedSearch);
      if (savedResume) setUserDump(savedResume);
    }
  }, []);

  const handleJobSelect = (job: Job) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kerjaflow_selected_job", JSON.stringify(job));
    }
    router.push("/kerjaflow/generate");
  };

  const handleModifySearch = () => {
    router.push("/kerjaflow/search");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-8">
      <Header currentView="results" />
      <main className="px-6 py-8">
        <ResultsView
          searchQuery={searchQuery}
          userDump={userDump}
          onJobSelect={handleJobSelect}
          onModifySearch={handleModifySearch}
        />
      </main>
      <StatusFooter />
    </div>
  );
}
