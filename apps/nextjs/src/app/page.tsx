"use client";

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { LoginView } from "./kerjaflow/_components/login-view";
import { StatusFooter } from "./kerjaflow/_components/status-footer";

export default function HomePage() {
  const router = useRouter();
  const { loaded } = useClerk();

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <RedirectToDump />
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-8">
          <main className="px-6">
            <LoginView />
          </main>
          <StatusFooter />
        </div>
      </SignedOut>
    </>
  );
}

function RedirectToDump() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dump");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
    </div>
  );
}
