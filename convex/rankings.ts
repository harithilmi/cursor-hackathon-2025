import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save ranking to database
export const saveRanking = mutation({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    fitScore: v.number(),
    aiReasoning: v.string(),
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
      rankedAt: Date.now(),
    });

    return rankingId;
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
          rankedAt: ranking.rankedAt,
          rankingId: ranking._id,
        };
      }),
    );

    return rankedJobs;
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
