"use client";

import { Briefcase, Database } from "lucide-react";
import { Button } from "@acme/ui/button";
import { signIn } from "~/auth/client";

interface LoginViewProps {
  onLogin: () => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/dump",
    });
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in duration-500">
      <div className="mb-8 p-6 bg-indigo-100 rounded-full shadow-lg relative group">
        <Briefcase size={64} className="text-indigo-600 relative z-10" />
        <div className="absolute inset-0 bg-indigo-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
      </div>
      <h1 className="text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
        KerjaFlow
      </h1>
      <p className="text-slate-500 mb-8 text-center max-w-md text-lg">
        The Malaysian Career Agent.
        <br />
        We tailor your resume to beat the ATS and the &quot;Chinaman&quot;
        filter.
      </p>

      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        size="lg"
        className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold shadow-sm hover:shadow-md transition-all hover:border-indigo-300"
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="G"
          className="w-5 h-5"
        />
        Continue with Google
      </Button>
      <div className="mt-8 flex gap-2 text-xs text-slate-400 font-mono bg-slate-100 px-3 py-1 rounded-full">
        <Database size={12} /> Powered by Convex
      </div>
    </div>
  );
}
