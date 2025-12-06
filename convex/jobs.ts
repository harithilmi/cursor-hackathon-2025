import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save multiple job listings from scraping
export const saveJobs = mutation({
  args: {
    userId: v.id("users"),
    searchTerm: v.string(),
    jobs: v.array(
      v.object({
        position: v.string(),
        company: v.string(),
        location: v.string(),
        description: v.string(),
        salary: v.optional(v.string()),
        url: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const jobIds = [];
    const scrapedAt = Date.now();

    for (const job of args.jobs) {
      const jobId = await ctx.db.insert("jobListings", {
        userId: args.userId,
        position: job.position,
        company: job.company,
        location: job.location,
        description: job.description,
        salary: job.salary,
        url: job.url,
        searchTerm: args.searchTerm,
        scrapedAt,
      });
      jobIds.push(jobId);
    }

    return jobIds;
  },
});

// Get all jobs for a user
export const getUserJobs = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobListings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return jobs;
  },
});

// Get jobs for a user by search term
export const getUserJobsBySearch = query({
  args: {
    userId: v.id("users"),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobListings")
      .withIndex("by_user_and_search", (q) =>
        q.eq("userId", args.userId).eq("searchTerm", args.searchTerm),
      )
      .order("desc")
      .collect();

    return jobs;
  },
});

// Get single job by ID
export const getJobById = query({
  args: {
    jobId: v.id("jobListings"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

// Delete a job listing
export const deleteJob = mutation({
  args: {
    jobId: v.id("jobListings"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.jobId);
  },
});

// Delete all jobs for a user
export const deleteUserJobs = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobListings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const job of jobs) {
      await ctx.db.delete(job._id);
    }
  },
});
