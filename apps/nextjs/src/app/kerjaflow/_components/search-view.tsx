import { Search, Zap, Loader2, CheckCircle2, Circle, Sparkles, ArrowRight } from "lucide-react";
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
  /* #region LOADING STATE */
  if (isLoading) {
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
      <div className="max-w-3xl mx-auto mt-12 space-y-8 animate-in zoom-in duration-300 relative">
        {/* Ambient Effects */}
        <div className="absolute top-[-20%] left-[10%] w-[400px] h-[400px] bg-brand-600/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-block p-4 bg-gradient-to-br from-brand-500/20 to-accent-500/20 rounded-full mb-2 relative">
            <Loader2 size={40} className="text-brand-400 animate-spin" />
            <div className="absolute inset-0 bg-brand-500 rounded-full blur-xl opacity-30 animate-pulse" />
          </div>
          <h1 className="text-4xl font-extrabold ai-gradient-text">
            Searching jobs on Hiredly
          </h1>
          <p className="text-lg text-slate-400">
            Scraping job listings for <span className="font-bold text-brand-400">&quot;{searchQuery}&quot;</span>
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full text-sm font-medium border border-amber-500/20">
            <Sparkles size={14} className="animate-pulse" />
            <span>Expected time: 1-2 minutes</span>
          </div>
        </div>

        {/* Progress Card */}
        <div className="glass-card p-8 rounded-2xl space-y-6 relative z-10">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-300">Overall Progress</span>
              <span className="text-2xl font-black text-brand-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500 h-full transition-all duration-700 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-700/50">
            {milestones.map((milestone, index) => {
              const isCompleted = progress >= milestone.threshold;
              const isActive = index === activeMilestoneIndex;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-brand-500/10 scale-[1.02] border border-brand-500/20' : 'bg-transparent'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />
                  ) : isActive ? (
                    <Loader2 size={20} className="text-brand-400 animate-spin flex-shrink-0" />
                  ) : (
                    <Circle size={20} className="text-slate-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      isCompleted ? 'text-green-400' : isActive ? 'text-brand-300 font-semibold' : 'text-slate-500'
                    }`}>
                      {milestone.label}
                    </span>
                    {milestone.duration && (
                      <span className="text-xs text-slate-500 font-mono">
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
        <div className="glass-panel p-6 rounded-xl relative z-10">
          <div className="flex gap-3">
            <div className="text-brand-400 mt-0.5">
              <Sparkles size={18} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-200">While you wait...</p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>We&apos;re using Claude AI to extract clean, structured job data</li>
                <li>After this, jobs will be automatically ranked based on your resume</li>
                <li>Rankings happen in parallel - much faster than scraping!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="flex justify-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs text-slate-500 glass-panel px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span>Please keep this tab open - process cannot be interrupted</span>
          </div>
        </div>
      </div>
    );
  }
  /* #endregion */

  /* #region SEARCH VIEW */
  return (
    <div className="max-w-6xl mx-auto mt-10 animate-in zoom-in duration-300 relative">
      {/* Ambient Effects */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-accent-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="mb-10 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
          Find your flow, <span className="ai-gradient-text">land the job.</span>
        </h1>
        <p className="text-slate-400 mb-8 max-w-2xl">
          Search jobs from Hiredly and let our AI rank them by resume compatibility. We&apos;ll even rewrite your resume for each application.
        </p>

        {/* Main Search Input */}
        <div className="relative group max-w-3xl">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-accent-400 rounded-2xl opacity-30 group-hover:opacity-75 transition duration-500 blur" />
          <div className="relative flex items-center bg-slate-900 rounded-2xl shadow-2xl p-2">
            <div className="pl-4 pr-3 text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && onSearch()}
              className="w-full bg-transparent border-none focus:ring-0 text-white px-2 py-3 text-lg placeholder:text-slate-600 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Job title, keywords, or company"
              autoFocus
              disabled={isLoading}
            />
            <div className="hidden sm:flex items-center gap-2 pr-2">
              <select className="bg-slate-800 text-slate-300 text-sm border-none rounded-lg py-2 px-3 focus:ring-1 focus:ring-brand-500 outline-none cursor-pointer hover:bg-slate-700 transition">
                <option>Malaysia (All)</option>
                <option>Kuala Lumpur</option>
                <option>Selangor</option>
                <option>Remote</option>
              </select>
              <button
                onClick={onSearch}
                disabled={isLoading}
                className="bg-brand-600 hover:bg-brand-500 text-white p-3 rounded-xl font-medium transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Sources */}
      <div className="flex gap-4 text-sm text-slate-500 relative z-10">
        <span>Supported Sources:</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-medium text-slate-300">Hiredly</span>
        </span>
        <span className="flex items-center gap-2 opacity-50">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span className="font-medium">JobStreet (Coming Soon)</span>
        </span>
      </div>
    </div>
  );
  /* #endregion */
}
