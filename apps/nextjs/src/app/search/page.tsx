"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchView } from "../kerjaflow/_components/search-view";
import { StatusFooter } from "../kerjaflow/_components/status-footer";
import { Header } from "../kerjaflow/_components/header";

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kerjaflow_search", searchQuery);
    }
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-8">
      <Header currentView="search" />
      <main className="px-6 py-8">
        <SearchView
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
      </main>
      <StatusFooter />
    </div>
  );
}
