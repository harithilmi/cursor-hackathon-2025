import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

import { env } from "~/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes timeout

interface JobListing {
  url: string;
  position: string;
  company: string;
  location: string;
  description: string;
  salary: string;
}

export async function POST(request: Request) {
  try {
    const { searchTerm } = (await request.json()) as { searchTerm: string };

    if (!searchTerm) {
      return NextResponse.json(
        { error: "Search term is required" },
        { status: 400 },
      );
    }

    // Initialize the ApifyClient with your API token
    const client = new ApifyClient({
      token: env.APIFY_API_TOKEN,
    });

    // Start the Actor and wait for it to finish
    console.log(`Starting Actor run for search term: ${searchTerm}`);
    const run = await client.actor("cashmere_quarter/hiredly-job-scraper").call(
      {
        searchTerm,
        maxRequestsPerCrawl: 5, // Scrape up to 5 jobs (faster)
      },
      {
        waitSecs: 180, // Wait up to 3 minutes for the run to finish
      },
    );

    // Fetch results from the run's dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    // Return all results (LLM parsing with structured outputs already done in Actor)
    const jobs = items as JobListing[];

    return NextResponse.json({ jobs, totalFound: jobs.length });
  } catch (error) {
    console.error("Error searching jobs:", error);
    return NextResponse.json(
      { error: "Failed to search jobs" },
      { status: 500 },
    );
  }
}
