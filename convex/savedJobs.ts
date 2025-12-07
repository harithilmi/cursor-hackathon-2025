import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save a job to user's saved list
export const saveJob = mutation({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
  },
  handler: async (ctx, args) => {
    // Check if already saved
    const existing = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("savedJobs", {
      userId: args.userId,
      jobId: args.jobId,
      savedAt: Date.now(),
    });
  },
});

// Remove a job from user's saved list
export const unsaveJob = mutation({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
  },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId)
      )
      .first();

    if (saved) {
      await ctx.db.delete(saved._id);
    }
  },
});

// Toggle save state for a job
export const toggleSaveJob = mutation({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
  },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId)
      )
      .first();

    if (saved) {
      await ctx.db.delete(saved._id);
      return { saved: false };
    } else {
      await ctx.db.insert("savedJobs", {
        userId: args.userId,
        jobId: args.jobId,
        savedAt: Date.now(),
      });
      return { saved: true };
    }
  },
});

// Get all saved jobs for a user (with full job details)
export const getSavedJobs = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const savedEntries = await ctx.db
      .query("savedJobs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const jobs = await Promise.all(
      savedEntries.map(async (saved) => {
        const job = await ctx.db.get(saved.jobId);
        if (!job) return null;
        return {
          ...job,
          savedAt: saved.savedAt,
          notes: saved.notes,
        };
      })
    );

    return jobs.filter((job) => job !== null);
  },
});

// Get saved job IDs for a user (for checking save state)
export const getSavedJobIds = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const savedEntries = await ctx.db
      .query("savedJobs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return savedEntries.map((s) => s.jobId);
  },
});

// Check if a specific job is saved
export const isJobSaved = query({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
  },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId)
      )
      .first();

    return !!saved;
  },
});

// Update notes for a saved job
export const updateSavedJobNotes = mutation({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId)
      )
      .first();

    if (saved) {
      await ctx.db.patch(saved._id, { notes: args.notes });
    }
  },
});
