"use client";

import React, { useState } from "react";
import { StatusFooter } from "./status-footer";
import { LoginView } from "./login-view";
import { ResumeDumpView } from "./resume-dump-view";
import { SearchView } from "./search-view";
import { ResultsView } from "./results-view";
import { GeneratorView } from "./generator-view";
import { FileText, Terminal } from "lucide-react";
import { MOCK_USER_DUMP_DEFAULT, type Job } from "../_lib/mock-data";

type View = "login" | "dump" | "search" | "results" | "generate";

export function KerjaFlowApp() {
  const [view, setView] = useState<View>("login");
  const [dumpResume, setDumpResume] = useState(MOCK_USER_DUMP_DEFAULT);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleLogin = () => setView("dump");
  const handleDumpComplete = () => setView("search");
  const handleSearch = () => setView("results");
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setView("generate");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-8">
      {/* #region HEADER */}
      {view !== "login" && (
        <header className="bg-background border-b-2 border-foreground py-3 px-6 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div
              className="flex items-center gap-2 text-foreground font-bold text-lg cursor-pointer select-none hover:text-accent transition-colors"
              onClick={() => setView("search")}
            >
              <Terminal className="size-5" strokeWidth={2.5} /> KerjaFlow
            </div>

            <div className="flex items-center gap-6">
              {view === "results" && (
                <div className="hidden md:flex items-center text-xs text-muted-foreground border border-foreground px-3 py-1">
                  <span className="w-1.5 h-1.5 bg-accent mr-2"></span>
                  Scraper Active
                </div>
              )}

              <div className="flex items-center gap-4">
                {view !== "generate" && view !== "dump" && (
                  <button
                    onClick={() => setView("dump")}
                    className="text-xs font-medium text-muted-foreground hover:text-accent flex items-center gap-1.5 transition-colors"
                  >
                    <FileText size={14} /> Master Dump
                  </button>
                )}
                <div className="w-8 h-8 border-2 border-foreground bg-foreground text-background flex items-center justify-center text-xs font-bold">
                  D
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
      {/* #endregion */}

      {/* #region MAIN CONTENT */}
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
      {/* #endregion */}

      <StatusFooter />
    </div>
  );
}
