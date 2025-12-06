"use client";

import React, { useState } from "react";
import { StatusFooter } from "./status-footer";
import { LoginView } from "./login-view";
import { ResumeDumpView } from "./resume-dump-view";
import { SearchView } from "./search-view";
import { ResultsView } from "./results-view";
import { GeneratorView } from "./generator-view";
import { Briefcase, FileText } from "lucide-react";
import { MOCK_USER_DUMP_DEFAULT, type Job } from "../_lib/mock-data";

type View = "login" | "dump" | "search" | "results" | "generate";

export function KerjaFlowApp() {
  const [view, setView] = useState<View>("login");
  const [dumpResume, setDumpResume] = useState(MOCK_USER_DUMP_DEFAULT);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Flow Handlers
  const handleLogin = () => setView("dump");
  const handleDumpComplete = () => setView("search");
  const handleSearch = () => setView("results");
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setView("generate");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-8">
      {/* Persistent Header */}
      {view !== "login" && (
        <header className="bg-white border-b border-slate-200 py-3 px-6 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div
              className="flex items-center gap-2 text-indigo-700 font-extrabold text-xl tracking-tight cursor-pointer select-none"
              onClick={() => setView("search")}
            >
              <Briefcase className="stroke-[3px]" /> KerjaFlow
            </div>

            <div className="flex items-center gap-6">
              {view === "results" && (
                <div className="hidden md:flex items-center text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Hiredly Scraper Active
                </div>
              )}

              <div className="flex items-center gap-3">
                {view !== "generate" && view !== "dump" && (
                  <button
                    onClick={() => setView("dump")}
                    className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-wide"
                  >
                    <FileText size={14} /> Master Dump
                  </button>
                )}
                <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  D
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Views */}
      <main className={`px-6 ${view !== "login" ? "py-8" : ""}`}>
        {view === "login" && <LoginView onLogin={handleLogin} />}

        {view === "dump" && (
          <ResumeDumpView
            resume={dumpResume}
            setResume={setDumpResume}
            onNext={handleDumpComplete}
          />
        )}

        {view === "search" && (
          <SearchView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
          />
        )}

        {view === "results" && (
          <ResultsView
            searchQuery={searchQuery}
            userDump={dumpResume}
            onJobSelect={handleJobSelect}
            onModifySearch={() => setView("search")}
          />
        )}

        {view === "generate" && selectedJob && (
          <GeneratorView
            job={selectedJob}
            userDump={dumpResume}
            onBack={() => setView("results")}
          />
        )}
      </main>

      {/* Mock Tech Stack Status Bar for Hackathon Demo */}
      <StatusFooter />
    </div>
  );
}
