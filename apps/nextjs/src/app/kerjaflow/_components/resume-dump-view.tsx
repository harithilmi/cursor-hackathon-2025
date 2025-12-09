import { ChevronRight, FileText, UploadCloud } from "lucide-react";
import { Button } from "@acme/ui/button";
import { Textarea } from "@acme/ui/textarea";
import { Card } from "@acme/ui/card";

interface ResumeDumpViewProps {
  resume: string;
  setResume: (resume: string) => void;
  onNext: () => void;
}

/**
 * Render the "Master Dump" step UI for pasting or uploading full career history.
 *
 * Renders a labeled textarea prefilled with `resume`, an upload PDF action, a character counter, and actions to skip or save; the Save action is enabled only when the pasted content has at least 20 characters.
 *
 * @param resume - The current resume text shown in the textarea.
 * @param setResume - Callback invoked with the updated textarea value when the user edits the resume.
 * @param onNext - Callback invoked to advance to the next step (triggered by "Skip for now" or "Save to Profile").
 * @returns A React element containing the master dump textarea, upload action, character counter, and skip/save controls.
 */
export function ResumeDumpView({
  resume,
  setResume,
  onNext,
}: ResumeDumpViewProps) {
  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {/* #region HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <div className="border-2 border-foreground p-3">
          <FileText className="text-foreground" size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Step 1: Master Dump
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Paste your entire career history here
          </p>
        </div>
      </div>
      {/* #endregion */}

      <Card className="p-0">
        {/* #region CARD HEADER */}
        <div className="flex justify-between items-center p-4 border-b border-muted">
          <label className="text-sm font-medium text-foreground">
            Raw Experience Data
          </label>
          <button className="text-accent text-xs font-medium flex items-center gap-1.5 hover:text-foreground transition-colors">
            <UploadCloud size={12} /> Upload PDF
          </button>
        </div>
        {/* #endregion */}

        {/* #region TEXTAREA */}
        <div className="relative p-4">
          <Textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full h-80 resize-none border-0 focus-visible:border-0 focus-visible:bg-transparent p-0"
            placeholder="Paste your experience here..."
          />
          <div className="absolute bottom-6 right-6 text-xs text-muted-foreground border border-muted px-2 py-1">
            {resume.length} chars
          </div>
        </div>
        {/* #endregion */}

        {/* #region ACTIONS */}
        <div className="p-4 border-t border-muted flex justify-between items-center">
          <button
            onClick={onNext}
            className="text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
          <Button
            onClick={onNext}
            disabled={resume.length < 20}
            className="flex items-center gap-2"
          >
            Save to Profile <ChevronRight size={14} />
          </Button>
        </div>
        {/* #endregion */}
      </Card>
    </div>
  );
}