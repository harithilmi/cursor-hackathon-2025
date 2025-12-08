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
  // Uses "Ruthless Gatekeeper" system with binary gate checks
  manualJobMatches: defineTable({
    userId: v.id("users"),
    rawInput: v.string(),
    position: v.string(),
    company: v.string(),

    // Tiered outcome classification (new system)
    outcome: v.optional(v.union(v.literal("MATCH"), v.literal("STRETCH"), v.literal("REJECT"))),
    interviewProbability: v.optional(v.number()), // 0-100

    // Hard requirements binary check (new system)
    hardRequirementsPassed: v.optional(v.boolean()),
    failedCriteria: v.optional(v.array(v.string())),

    // Score breakdown (new scoring engine system)
    scores: v.optional(v.object({
      hardSkillsSum: v.number(),      // 0-50
      experiencePenalty: v.number(),  // -30 to 0
      domainPenalty: v.number(),      // -20 to 0
      metricsBonus: v.number(),       // 0-20
      techStackBonus: v.number(),     // 0-10
    })),

    // Resume gaps with severity and fix strategies (new system)
    resumeGaps: v.optional(v.array(v.object({
      skill: v.string(),
      severity: v.union(v.literal("CRITICAL"), v.literal("MINOR")),
      fixStrategy: v.string(),
    }))),

    verdictReasoning: v.optional(v.string()),

    // Legacy fields (to be removed after migration)
    fitScore: v.optional(v.number()),
    aiReasoning: v.optional(v.string()),
    keyStrengths: v.optional(v.array(v.string())),
    potentialChallenges: v.optional(v.array(v.string())),
    criticalSkillsFound: v.optional(v.array(v.string())),
    criticalSkillsMissing: v.optional(v.array(v.string())),
    penaltyCalculation: v.optional(v.string()),

    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
