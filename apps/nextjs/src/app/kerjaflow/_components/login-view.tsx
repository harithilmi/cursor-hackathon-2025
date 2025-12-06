"use client";

import { Briefcase, Database, Sparkles } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@acme/ui/button";

export function LoginView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-in fade-in zoom-in duration-500 relative">
      {/* #region AMBIENT EFFECTS */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-accent-500/5 blur-[100px] rounded-full pointer-events-none" />
      {/* #endregion */}

      {/* #region LOGO */}
      <div className="mb-8 p-6 bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 rounded-full shadow-2xl relative group">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
          <Briefcase size={40} className="text-white relative z-10" />
        </div>
        <div className="absolute inset-0 bg-brand-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />
      </div>
      {/* #endregion */}

      {/* #region TITLE */}
      <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
        Kerja<span className="text-brand-400">Flow</span>
      </h1>
      <p className="text-slate-400 mb-2 text-center max-w-md text-lg">
        The Malaysian Career Agent.
      </p>
      <p className="ai-gradient-text font-semibold mb-8 text-center">
        AI-powered resume tailoring to beat ATS systems
      </p>
      {/* #endregion */}

      {/* #region CTA */}
      <SignInButton mode="modal" forceRedirectUrl="/dump">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold bg-slate-900 border-slate-700 text-white hover:bg-slate-800 hover:border-brand-500/50 transition-all shadow-xl shadow-black/20"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="G"
            className="w-5 h-5"
          />
          Continue with Google
        </Button>
      </SignInButton>
      {/* #endregion */}

      {/* #region FOOTER */}
      <div className="mt-8 flex gap-2 text-xs text-slate-500 font-mono glass-panel px-4 py-2 rounded-full">
        <Sparkles size={12} className="text-brand-400" /> Powered by Claude AI
        <span className="text-slate-700">•</span>
        <Database size={12} className="text-accent-400" /> Convex DB
      </div>
      {/* #endregion */}
    </div>
  );
}
