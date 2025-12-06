import { AlertTriangle, Briefcase, ChevronRight, MapPin } from "lucide-react";
import { Card } from "@acme/ui/card";
import { Badge } from "@acme/ui/badge";
import type { Job } from "../_lib/mock-data";

interface JobCardProps {
  job: Job;
  fitScore: number;
  onClick: (job: Job) => void;
}

export function JobCard({ job, fitScore, onClick }: JobCardProps) {
  return (
    <Card
      onClick={() => onClick(job)}
      className="p-0 hover:border-accent transition-colors cursor-pointer group relative overflow-hidden flex flex-col"
    >
      {/* #region HEADER */}
      <div className="p-4 flex justify-between items-start border-b border-muted">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {job.company}
          </p>
        </div>

        <div className="text-right ml-4 shrink-0">
          <div
            className={`text-lg font-bold tabular-nums ${
              fitScore > 80
                ? "text-accent"
                : fitScore > 60
                  ? "text-foreground"
                  : "text-muted-foreground"
            }`}
          >
            {fitScore}%
          </div>
          <div className="text-[9px] text-muted-foreground">
            Fit Score
          </div>
        </div>
      </div>
      {/* #endregion */}

      {/* #region BODY */}
      <div className="p-4 flex-1">
        {job.risk_level === "High Risk" && (
          <div className="inline-flex items-center gap-1 text-[10px] font-medium text-destructive border border-destructive px-2 py-0.5 mb-3">
            <AlertTriangle size={10} /> Red Flag
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin size={12} className="mr-1" /> {job.location}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Briefcase size={12} className="mr-1" /> {job.salary}
          </div>
        </div>
      </div>
      {/* #endregion */}

      {/* #region FOOTER */}
      <div className="border-t border-muted p-4 flex items-center justify-between">
        <div className="flex gap-1.5 overflow-hidden">
          {job.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[9px]"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-accent text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          Generate <ChevronRight size={12} />
        </div>
      </div>
      {/* #endregion */}
    </Card>
  );
}
