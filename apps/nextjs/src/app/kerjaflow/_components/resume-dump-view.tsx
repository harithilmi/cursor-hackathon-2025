import { ChevronRight, FileText, UploadCloud } from "lucide-react";
import { Button } from "@kerjaflow/ui/button";
import { Textarea } from "@kerjaflow/ui/textarea";
import { Card } from "@kerjaflow/ui/card";

interface ResumeDumpViewProps {
  resume: string;
  setResume: (resume: string) => void;
  onNext: () => void;
  isLoading?: boolean;
}

export function ResumeDumpView({
  resume,
  setResume,
  onNext,
  isLoading = false,
}: ResumeDumpViewProps) {
  return (
    <div className="max-w-3xl mx-auto mt-10 animate-in slide-in-from-bottom-4 duration-500 px-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-indigo-100 p-3 rounded-full">
          <FileText className="text-indigo-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Step 1: The &quot;Master Dump&quot;
          </h2>
          <p className="text-slate-500 text-sm">
            Paste your <strong>entire</strong> career history here. We use this
            &quot;Master Data&quot; to generate specific, tailored PDFs for each job
            application.
          </p>
        </div>
      </div>

      <Card className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-slate-700">
            Raw Experience Data
          </label>
          <button className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline">
            <UploadCloud size={14} /> Upload Existing PDF
          </button>
        </div>

        <div className="relative">
          <Textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full h-80 p-4 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none font-mono text-sm leading-relaxed bg-slate-50 resize-none"
            placeholder="I worked at Company A doing X, Y, Z. I know React, Python. I like badminton..."
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-white/90 px-2 py-1 rounded border border-slate-200 shadow-sm">
            {resume.length} chars
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={onNext}
            className="text-slate-400 text-sm hover:text-slate-600 font-medium"
          >
            Skip for now
          </button>
          <Button
            onClick={onNext}
            disabled={resume.length < 20 || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save to Profile"} <ChevronRight size={20} />
          </Button>
        </div>
      </Card>
    </div>
  );
}
