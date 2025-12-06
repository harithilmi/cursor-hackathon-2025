import { Search, Zap, Loader2, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

interface SearchViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
  progress?: number;
}

export function SearchView({
  searchQuery,
  setSearchQuery,
  onSearch,
  isLoading = false,
  progress = 0,
}: SearchViewProps) {
  if (isLoading) {
    // Define milestones based on typical scraping flow
    const milestones = [
      { label: "Initializing Apify Actor", threshold: 10, duration: "~5s" },
      { label: "Navigating to Hiredly", threshold: 20, duration: "~10s" },
      { label: "Searching job listings", threshold: 30, duration: "~15s" },
      { label: "Extracting job details", threshold: 50, duration: "~60s" },
      { label: "AI parsing with Claude", threshold: 70, duration: "~30s" },
      { label: "Saving to database", threshold: 90, duration: "~5s" },
      { label: "Complete!", threshold: 100, duration: "" },
    ];

    const currentMilestone = milestones.findIndex(m => progress < m.threshold);
    const activeMilestoneIndex = currentMilestone === -1 ? milestones.length - 1 : Math.max(0, currentMilestone - 1);

    return (
      <div className="max-w-3xl mx-auto mt-12 space-y-8 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full mb-2 relative">
            <Loader2 size={40} className="text-indigo-600 animate-spin" />
            <div className="absolute inset-0 bg-indigo-400 rounded-full blur-xl opacity-20 animate-pulse" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Searching jobs on Hiredly
          </h1>
          <p className="text-lg text-slate-600">
            Scraping job listings for <span className="font-bold text-indigo-600">&quot;{searchQuery}&quot;</span>
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
            <Sparkles size={14} className="animate-pulse" />
            <span>Expected time: 1-2 minutes</span>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
              <span className="text-2xl font-black text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-full transition-all duration-700 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            {milestones.map((milestone, index) => {
              const isCompleted = progress >= milestone.threshold;
              const isActive = index === activeMilestoneIndex;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-indigo-50 scale-105' : 'bg-transparent'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                  ) : isActive ? (
                    <Loader2 size={20} className="text-indigo-600 animate-spin flex-shrink-0" />
                  ) : (
                    <Circle size={20} className="text-slate-300 flex-shrink-0" />
                  )}
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      isCompleted ? 'text-green-600' : isActive ? 'text-indigo-700 font-semibold' : 'text-slate-400'
                    }`}>
                      {milestone.label}
                    </span>
                    {milestone.duration && (
                      <span className="text-xs text-slate-400 font-mono">
                        {milestone.duration}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <div className="flex gap-3">
            <div className="text-blue-600 mt-0.5">
              <Sparkles size={18} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-blue-900">While you wait...</p>
              <ul className="text-xs text-blue-700 space-y-1.5 list-disc list-inside">
                <li>We&apos;re using Claude AI to extract clean, structured job data</li>
                <li>After this, jobs will be automatically ranked based on your resume</li>
                <li>Rankings happen in parallel - much faster than scraping!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span>Please keep this tab open - process cannot be interrupted</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 text-center space-y-6 animate-in zoom-in duration-300">
      <div className="inline-block p-4 bg-indigo-50 rounded-full mb-2">
        <Search size={32} className="text-indigo-600" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">
        Find your next role.
      </h1>
      <p className="text-slate-500">
        We&apos;ll rank jobs from{" "}
        <span className="font-bold text-slate-700">Hiredly</span> based on how
        well they fit your &quot;Master Dump&quot;.
      </p>

      <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-200 flex items-center transform transition-transform focus-within:scale-105">
        <Search className="ml-4 text-slate-400" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && onSearch()}
          className="flex-1 p-4 outline-none text-lg text-slate-700 placeholder:text-slate-300 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="e.g. React Developer"
          autoFocus
          disabled={isLoading}
        />
        <Button
          onClick={onSearch}
          disabled={isLoading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search <Zap size={16} fill="white" />
        </Button>
      </div>

      <div className="flex justify-center gap-2 text-xs text-slate-400 mt-8">
        <span>Supported Sources:</span>
        <span className="font-bold text-slate-600">Hiredly (Active)</span>
        <span>•</span>
        <span className="font-bold text-slate-400">JobStreet (Coming Soon)</span>
      </div>
    </div>
  );
}
