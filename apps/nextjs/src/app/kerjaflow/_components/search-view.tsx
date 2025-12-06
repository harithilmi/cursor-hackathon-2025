import { Search, Zap } from "lucide-react";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

interface SearchViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
}

export function SearchView({
  searchQuery,
  setSearchQuery,
  onSearch,
}: SearchViewProps) {
  return (
    <div className="max-w-xl mx-auto mt-16 text-center space-y-8">
      <div className="inline-block p-4 border-2 border-foreground mb-2">
        <Search size={28} className="text-foreground" strokeWidth={1.5} />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold text-foreground">
          Find your next role
        </h1>
        <p className="text-sm text-muted-foreground">
          Ranking jobs from <span className="text-foreground font-medium">Hiredly</span> against your Master Dump
        </p>
      </div>

      <div className="border-2 border-foreground p-1 flex items-center">
        <Search className="ml-3 text-muted-foreground size-4" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="flex-1 border-0 focus-visible:border-0 focus-visible:bg-transparent"
          placeholder="e.g. React Developer"
          autoFocus
        />
        <Button onClick={onSearch} className="flex items-center gap-2">
          Search <Zap size={14} />
        </Button>
      </div>

      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span className="border-b border-accent text-foreground">Hiredly (Active)</span>
        <span>JobStreet (Coming Soon)</span>
      </div>
    </div>
  );
}
