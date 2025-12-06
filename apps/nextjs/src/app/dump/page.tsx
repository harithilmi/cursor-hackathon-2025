"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { ResumeDumpView } from "../kerjaflow/_components/resume-dump-view";
import { StatusFooter } from "../kerjaflow/_components/status-footer";
import { Header } from "../kerjaflow/_components/header";
import { MOCK_USER_DUMP_DEFAULT } from "../kerjaflow/_lib/mock-data";

export default function DumpPage() {
  const router = useRouter();
  const { user } = useUser();
  const [resume, setResume] = useState(MOCK_USER_DUMP_DEFAULT);
  const [isSaving, setIsSaving] = useState(false);

  const saveResume = useMutation(api.resumes.saveResume);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  // Load existing resume if available
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const existingResume = useQuery(
    api.resumes.getUserResume,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  useEffect(() => {
    if (existingResume?.content) {
      setResume(existingResume.content);
    }
  }, [existingResume]);

  const handleNext = async () => {
    if (!user) {
      alert("Please sign in to save your resume");
      return;
    }

    try {
      setIsSaving(true);

      // Get or create user in Convex
      const userId = await getOrCreateUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || undefined,
      });

      // Save resume to Convex
      await saveResume({
        userId,
        content: resume,
      });

      // Also keep in localStorage as fallback
      if (typeof window !== "undefined") {
        localStorage.setItem("kerjaflow_resume", resume);
      }

      router.push("/search");
    } catch (error) {
      console.error("Failed to save resume:", error);
      alert("Failed to save resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-8">
      <Header currentView="dump" />
      <main className="px-6 py-8">
        <ResumeDumpView
          resume={resume}
          setResume={setResume}
          onNext={handleNext}
          isLoading={isSaving}
        />
      </main>
      <StatusFooter />
    </div>
  );
}
