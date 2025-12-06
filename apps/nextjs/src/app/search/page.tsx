"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { SearchView } from "../kerjaflow/_components/search-view";
import { StatusFooter } from "../kerjaflow/_components/status-footer";
import { Header } from "../kerjaflow/_components/header";

export default function SearchPage() {
  const router = useRouter();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);

  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term");
      return;
    }

    if (!user) {
      alert("Please sign in to search for jobs");
      return;
    }

    try {
      setIsSearching(true);
      setProgress(0);

      // Simulate realistic progress during the scraping process
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we get closer to 90%
          if (prev < 20) return prev + 2;
          if (prev < 40) return prev + 1.5;
          if (prev < 60) return prev + 1;
          if (prev < 85) return prev + 0.5;
          return prev; // Stop at 85%, wait for actual completion
        });
      }, 1000);

      // Get or create user in Convex
      const userId = await getOrCreateUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || undefined,
      });

      setProgress(10);

      // Call the search-jobs API endpoint (it will save to Convex)
      const response = await fetch("/api/search-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchTerm: searchQuery,
          userId: userId,
        }),
      });

      clearInterval(progressInterval);
      setProgress(90);

      if (!response.ok) {
        throw new Error("Failed to search jobs");
      }

      const data = await response.json();

      setProgress(100);

      // Save to localStorage as fallback
      if (typeof window !== "undefined") {
        localStorage.setItem("kerjaflow_search", searchQuery);
      }

      // Small delay to show 100% completion
      setTimeout(() => {
        router.push("/results");
      }, 500);
    } catch (error) {
      console.error("Failed to search jobs:", error);
      alert("Failed to search jobs. Please try again.");
      setIsSearching(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-8">
      <Header currentView="search" />
      <main className="px-6 py-8">
        <SearchView
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          isLoading={isSearching}
          progress={progress}
        />
      </main>
      <StatusFooter />
    </div>
  );
}
