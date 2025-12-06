import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";

// Declare process for Convex runtime environment
declare const process: { env: Record<string, string | undefined> };

// Save ranking to database
export const saveRanking = mutation({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    fitScore: v.number(),
    aiReasoning: v.string(),
    keyStrengths: v.optional(v.array(v.string())),
    potentialChallenges: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Check if ranking already exists
    const existingRanking = await ctx.db
      .query("jobRankings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .first();

    if (existingRanking) {
      // Update existing ranking
      await ctx.db.patch(existingRanking._id, {
        fitScore: args.fitScore,
        aiReasoning: args.aiReasoning,
        keyStrengths: args.keyStrengths,
        potentialChallenges: args.potentialChallenges,
        rankedAt: Date.now(),
      });
      return existingRanking._id;
    }

    // Create new ranking
    const rankingId = await ctx.db.insert("jobRankings", {
      userId: args.userId,
      jobId: args.jobId,
      fitScore: args.fitScore,
      aiReasoning: args.aiReasoning,
      keyStrengths: args.keyStrengths,
      potentialChallenges: args.potentialChallenges,
      rankedAt: Date.now(),
    });

    return rankingId;
  },
});

// Action to rank a single job using Claude API
export const rankSingleJob = action({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    resumeContent: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch job details
    const job = await ctx.runQuery(api.jobs.getJobById, { jobId: args.jobId });

    if (!job) {
      throw new Error("Job not found");
    }

    const apiKey = process.env.ANTHROPIC_API_KEY!;
    if (!apiKey) {
      throw new Error("Anthropic API key not configured");
    }

    // Define the JSON schema for structured output
    const schema = {
      type: "object",
      properties: {
        fitScore: {
          type: "number",
          description: "A score from 0-100 indicating how well the candidate fits the job",
        },
        reasoning: {
          type: "string",
          description: "Detailed explanation of the fit score, analyzing candidate's experience against job requirements",
        },
        keyStrengths: {
          type: "array",
          items: { type: "string" },
          description: "List of 3-5 key strengths that make the candidate a good fit",
        },
        potentialChallenges: {
          type: "array",
          items: { type: "string" },
          description: "List of 2-3 areas where the candidate might face challenges or needs growth",
        },
      },
      required: ["fitScore", "reasoning", "keyStrengths", "potentialChallenges"],
      additionalProperties: false,
    };

    // Call Claude API with structured outputs
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "structured-outputs-2025-11-13",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 2048,
        temperature: 0.3,
        output_format: {
          type: "json_schema",
          schema: schema,
        },
        messages: [
          {
            role: "user",
            content: `You are an expert job matching AI. Analyze how well this candidate's resume fits the job posting.

Job Position: ${job.position}
Company: ${job.company}

Job Description:
${job.description}

Candidate's Resume:
${args.resumeContent}

Provide a detailed analysis of the candidate's fit for this role. Consider:
- Relevant experience and skills
- Technical qualifications
- Soft skills and cultural fit indicators
- Career progression alignment
- Location and availability (if mentioned)

Be honest and balanced in your assessment. A perfect fit would be 90-100, strong fit 75-89, good fit 60-74, moderate fit 45-59, and below 45 indicates significant gaps.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Failed to rank job: ${response.status}`);
    }

    const data = await response.json();
    const ranking = JSON.parse(data.content[0].text);

    // Save ranking to database
    await ctx.runMutation(api.rankings.saveRanking, {
      userId: args.userId,
      jobId: args.jobId,
      fitScore: ranking.fitScore,
      aiReasoning: ranking.reasoning,
      keyStrengths: ranking.keyStrengths,
      potentialChallenges: ranking.potentialChallenges,
    });

    return {
      jobId: args.jobId,
      fitScore: ranking.fitScore,
      aiReasoning: ranking.reasoning,
      keyStrengths: ranking.keyStrengths,
      potentialChallenges: ranking.potentialChallenges,
    };
  },
});

// Action to rank all jobs for a search term in parallel
export const rankJobsForSearch = action({
  args: {
    userId: v.id("users"),
    searchTerm: v.string(),
  },
  handler: async (ctx, args): Promise<Array<{
    jobId: Id<"jobListings">;
    fitScore: number;
    aiReasoning: string;
    keyStrengths: string[];
    potentialChallenges: string[];
  }>> => {
    // Get user's resume
    const resume = await ctx.runQuery(api.resumes.getUserResume, {
      userId: args.userId,
    });

    if (!resume?.content) {
      throw new Error("No resume found for user");
    }

    // Get jobs for this search
    const jobs: Array<Doc<"jobListings">> = await ctx.runQuery(api.jobs.getUserJobsBySearch, {
      userId: args.userId,
      searchTerm: args.searchTerm,
    });

    if (!jobs || jobs.length === 0) {
      return [];
    }

    // Rank all jobs in parallel
    const rankingPromises: Array<Promise<{
      jobId: Id<"jobListings">;
      fitScore: number;
      aiReasoning: string;
      keyStrengths: string[];
      potentialChallenges: string[];
    }>> = jobs.map((job: Doc<"jobListings">) =>
      ctx.runAction(api.rankings.rankSingleJob, {
        userId: args.userId,
        jobId: job._id,
        resumeContent: resume.content,
      }).catch((error: any) => {
        console.error(`Failed to rank job ${job._id}:`, error);
        // Return a fallback ranking on error
        return {
          jobId: job._id,
          fitScore: 0,
          aiReasoning: "Failed to rank this job",
          keyStrengths: [],
          potentialChallenges: [],
        };
      })
    );

    const rankings: Array<{
      jobId: Id<"jobListings">;
      fitScore: number;
      aiReasoning: string;
      keyStrengths: string[];
      potentialChallenges: string[];
    }> = await Promise.all(rankingPromises);
    return rankings;
  },
});

// Get ranking for a specific job
export const getRankingForJob = query({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
  },
  handler: async (ctx, args) => {
    const ranking = await ctx.db
      .query("jobRankings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .first();

    return ranking;
  },
});

// Get all rankings for a user, sorted by fit score
export const getUserRankings = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const rankings = await ctx.db
      .query("jobRankings")
      .withIndex("by_user_and_score", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return rankings;
  },
});

// Get ranked jobs with job details
export const getUserRankedJobs = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all rankings sorted by score
    const rankings = await ctx.db
      .query("jobRankings")
      .withIndex("by_user_and_score", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    // Fetch job details for each ranking
    const rankedJobs = await Promise.all(
      rankings.map(async (ranking) => {
        const job = await ctx.db.get(ranking.jobId);
        return {
          ...job,
          fitScore: ranking.fitScore,
          aiReasoning: ranking.aiReasoning,
          keyStrengths: ranking.keyStrengths,
          potentialChallenges: ranking.potentialChallenges,
          rankedAt: ranking.rankedAt,
          rankingId: ranking._id,
        };
      }),
    );

    return rankedJobs;
  },
});

// Get jobs for a search with their rankings (if available)
export const getJobsWithRankings = query({
  args: {
    userId: v.id("users"),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all jobs for this search
    const jobs = await ctx.db
      .query("jobListings")
      .withIndex("by_user_and_search", (q) =>
        q.eq("userId", args.userId).eq("searchTerm", args.searchTerm)
      )
      .order("desc")
      .collect();

    // Fetch ranking for each job (if exists)
    const jobsWithRankings = await Promise.all(
      jobs.map(async (job) => {
        const ranking = await ctx.db
          .query("jobRankings")
          .withIndex("by_user", (q) => q.eq("userId", args.userId))
          .filter((q) => q.eq(q.field("jobId"), job._id))
          .first();

        if (ranking) {
          return {
            ...job,
            fitScore: ranking.fitScore,
            aiReasoning: ranking.aiReasoning,
            keyStrengths: ranking.keyStrengths,
            potentialChallenges: ranking.potentialChallenges,
            rankedAt: ranking.rankedAt,
            rankingId: ranking._id,
          };
        }

        // Return job without ranking (still being ranked)
        return {
          ...job,
          fitScore: undefined,
          aiReasoning: undefined,
          keyStrengths: undefined,
          potentialChallenges: undefined,
          rankedAt: undefined,
          rankingId: undefined,
        };
      })
    );

    // Sort: ranked jobs first (by score desc), then unranked jobs
    jobsWithRankings.sort((a, b) => {
      if (a.fitScore !== undefined && b.fitScore !== undefined) {
        return b.fitScore - a.fitScore;
      }
      if (a.fitScore !== undefined) return -1;
      if (b.fitScore !== undefined) return 1;
      return 0;
    });

    return jobsWithRankings;
  },
});

// Delete a ranking
export const deleteRanking = mutation({
  args: {
    rankingId: v.id("jobRankings"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.rankingId);
  },
});
