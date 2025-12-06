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
    .index("by_user_and_search", ["userId", "searchTerm"]),

  // AI-generated job rankings based on resume fit
  jobRankings: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    fitScore: v.number(), // 0-100
    aiReasoning: v.string(),
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
});
