"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResumeDumpView } from "../_components/resume-dump-view";
import { StatusFooter } from "../_components/status-footer";
import { Header } from "../_components/header";
import { MOCK_USER_DUMP_DEFAULT } from "../_lib/mock-data";

export default function DumpPage() {
  const router = useRouter();
  const [resume, setResume] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("kerjaflow_resume") || MOCK_USER_DUMP_DEFAULT
      : MOCK_USER_DUMP_DEFAULT,
  );

  const handleNext = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kerjaflow_resume", resume);
    }
    router.push("/kerjaflow/search");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-8">
      <Header currentView="dump" />
      <main className="px-6 py-8">
        <ResumeDumpView resume={resume} setResume={setResume} onNext={handleNext} />
      </main>
      <StatusFooter />
    </div>
  );
}
