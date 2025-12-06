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
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
    >
      {/* Fit Score Badge */}
      <div className="absolute top-0 right-0 p-4">
        <div className="flex flex-col items-end">
          <div
            className={`text-2xl font-black ${
              fitScore > 80
                ? "text-green-600"
                : fitScore > 60
                  ? "text-indigo-600"
                  : "text-slate-400"
            }`}
          >
            {fitScore}%
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Fit Score
          </div>
        </div>
      </div>

      <div className="pr-16">
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {job.title}
        </h3>
        <p className="text-slate-500 text-sm mb-3 font-medium">
          {job.company}
        </p>

        {job.risk_level === "High Risk" && (
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 mb-3">
            <AlertTriangle size={10} /> RED FLAG DETECTED
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
          <MapPin size={12} className="mr-1" /> {job.location}
        </div>
        <div className="flex items-center text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
          <Briefcase size={12} className="mr-1" /> {job.salary}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-auto">
        <div className="flex gap-1 overflow-hidden">
          {job.tags?.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 whitespace-nowrap"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-indigo-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pl-2">
          Generate <ChevronRight size={14} />
        </div>
      </div>
    </Card>
  );
}
