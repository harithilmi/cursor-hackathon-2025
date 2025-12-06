"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchView } from "../_components/search-view";
import { StatusFooter } from "../_components/status-footer";
import { Header } from "../_components/header";

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kerjaflow_search", searchQuery);
    }
    router.push("/kerjaflow/results");
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
