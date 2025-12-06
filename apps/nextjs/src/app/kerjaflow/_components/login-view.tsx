import { Database, Terminal } from "lucide-react";
import { Button } from "@acme/ui/button";

interface LoginViewProps {
  onLogin: () => void;
}

/**
 * Render a centered login view with brand header, a "Continue with Google" action, and a "Powered by Convex" badge.
 *
 * The primary button calls the provided callback when activated.
 *
 * @param onLogin - Callback invoked when the user activates the "Continue with Google" button.
 * @returns The React element for the login screen.
 */
export function LoginView({ onLogin }: LoginViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="mb-8 p-6 border-2 border-foreground relative">
        <Terminal size={48} className="text-foreground" strokeWidth={1.5} />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          KerjaFlow
        </h1>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>The Malaysian Career Agent</p>
          <p>Beat the ATS. Beat the system.</p>
        </div>
      </div>

      <Button
        onClick={onLogin}
        variant="outline"
        size="lg"
        className="flex items-center gap-3"
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="G"
          className="w-4 h-4"
        />
        Continue with Google
      </Button>

      <div className="mt-12 flex gap-2 text-xs text-muted-foreground border border-muted px-3 py-1.5">
        <Database size={12} /> Powered by Convex
      </div>
    </div>
  );
}