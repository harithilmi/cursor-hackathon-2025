import { Search, Zap, Loader2 } from "lucide-react";
import { Button } from "@kerjaflow/ui/button";
import { Input } from "@kerjaflow/ui/input";

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
    return (
      <div className="max-w-xl mx-auto mt-16 text-center space-y-6 animate-in zoom-in duration-300">
        <div className="inline-block p-4 bg-indigo-50 rounded-full mb-2">
          <Loader2 size={32} className="text-indigo-600 animate-spin" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Searching jobs on Hiredly...
        </h1>
        <p className="text-slate-500">
          This may take 3-5 minutes. We&apos;re scraping job listings for &quot;{searchQuery}&quot;
        </p>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-600">
            {progress < 20 && "Initializing scraper..."}
            {progress >= 20 && progress < 70 && "Fetching jobs from Hiredly..."}
            {progress >= 70 && progress < 90 && "Processing results..."}
            {progress >= 90 && "Saving jobs..."}
          </p>
        </div>

        <div className="flex justify-center gap-2 text-xs text-slate-400 mt-8">
          <span>Please wait, this process cannot be interrupted</span>
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
