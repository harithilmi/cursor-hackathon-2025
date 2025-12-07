import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles from Clerk authentication
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // User's "dump" resume (full resume with all experiences)
  resumes: defineTable({
    userId: v.id("users"),
    content: v.string(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Scraped job listings from Hiredly
  jobListings: defineTable({
    userId: v.id("users"),
    position: v.string(),
    company: v.string(),
    location: v.string(),
    description: v.string(),
    salary: v.optional(v.string()),
    url: v.string(),
    searchTerm: v.string(),
    scrapedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_search", ["userId", "searchTerm"])
    .index("by_url", ["url"])
    .index("by_user_and_url", ["userId", "url"]),

  // User's saved/bookmarked jobs
  savedJobs: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    savedAt: v.number(),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_job", ["jobId"])
    .index("by_user_and_job", ["userId", "jobId"]),

  // AI-generated job rankings based on resume fit
  jobRankings: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    fitScore: v.number(), // 0-100
    aiReasoning: v.string(),
    keyStrengths: v.optional(v.array(v.string())),
    potentialChallenges: v.optional(v.array(v.string())),
    rankedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_job", ["jobId"])
    .index("by_user_and_score", ["userId", "fitScore"]),

  // AI-generated tailored resumes and cover letters
  generatedDocuments: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    type: v.union(v.literal("resume"), v.literal("cover_letter")),
    content: v.string(),
    pdfUrl: v.optional(v.string()),
    generatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_job", ["jobId"])
    .index("by_user_and_job", ["userId", "jobId"]),

  // Manual job match calculations (user-pasted job descriptions)
  manualJobMatches: defineTable({
    userId: v.id("users"),
    rawInput: v.string(),
    position: v.string(),
    company: v.string(),
    fitScore: v.number(),
    aiReasoning: v.string(),
    keyStrengths: v.array(v.string()),
    potentialChallenges: v.array(v.string()),
    criticalSkillsFound: v.optional(v.array(v.string())),
    criticalSkillsMissing: v.optional(v.array(v.string())),
    penaltyCalculation: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_score", ["userId", "fitScore"]),
});
