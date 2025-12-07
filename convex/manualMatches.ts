import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// Declare process for Convex runtime environment
declare const process: { env: Record<string, string | undefined> };

// Action to calculate match for a manually pasted job description
export const calculateMatch = action({
  args: {
    userId: v.id("users"),
    rawInput: v.string(),
    resumeContent: v.string(),
  },
  handler: async (ctx, args): Promise<{
    matchId: Id<"manualJobMatches">;
    position: string;
    company: string;
    fitScore: number;
    aiReasoning: string;
    keyStrengths: string[];
    potentialChallenges: string[];
    criticalSkillsFound: string[];
    criticalSkillsMissing: string[];
    penaltyCalculation: string;
  }> => {
    const apiKey = process.env.ANTHROPIC_API_KEY!;
    if (!apiKey) {
      throw new Error("Anthropic API key not configured");
    }

    // Define the JSON schema for structured output (flat structure for better compatibility)
    const schema = {
      type: "object",
      properties: {
        position: {
          type: "string",
          description: "The job position/title extracted from the job description",
        },
        company: {
          type: "string",
          description: "The company name extracted from the job description",
        },
        criticalSkillsFound: {
          type: "array",
          items: { type: "string" },
          description: "Must-have skills the candidate HAS",
        },
        criticalSkillsMissing: {
          type: "array",
          items: { type: "string" },
          description: "Must-have skills the candidate is MISSING",
        },
        penaltyCalculation: {
          type: "string",
          description: "Show the math: Started at 100, -15 for X, -20 for Y, +5 for Z = final score",
        },
        fitScore: {
          type: "number",
          description: "Final score 0-100 after subtractive calculation. Do NOT round to 0 or 5.",
        },
        reasoning: {
          type: "string",
          description: "Summary of why this score was given",
        },
        keyStrengths: {
          type: "array",
          items: { type: "string" },
          description: "3-5 specific strengths matching the JD",
        },
        potentialChallenges: {
          type: "array",
          items: { type: "string" },
          description: "2-3 red flags or gaps that could be deal-breakers",
        },
      },
      required: ["position", "company", "criticalSkillsFound", "criticalSkillsMissing", "penaltyCalculation", "fitScore", "reasoning", "keyStrengths", "potentialChallenges"],
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
        model: "claude-sonnet-4-5",
        max_tokens: 2048,
        temperature: 0.3,
        output_format: {
          type: "json_schema",
          schema: schema,
        },
        messages: [
          {
            role: "user",
            content: `You are a ruthless technical recruiter. You do NOT grade on a curve. You look for reasons to REJECT candidates. Your goal is to identify the precise gap between the Job Description and the Resume.

### JOB DESCRIPTION:
${args.rawInput}

### CANDIDATE RESUME:
${args.resumeContent}

### INSTRUCTIONS - SUBTRACTIVE SCORING MODEL

**Step 1: CRITICAL ANALYSIS**
- Identify the top 3 "Must-Have" hard skills in the JD
- Check strictly if the candidate has them (exact or very close match only)
- Identify Years of Experience (YoE) requirement vs Candidate's actual YoE

**Step 2: CALCULATE SCORE (Start at 100, subtract penalties)**

PENALTIES:
- Missing a top-3 critical skill: **-15 points EACH**
- Missing other required skills: **-5 points EACH**
- Experience gap (candidate has <80% of required YoE): **-20 points**
- Domain/industry mismatch: **-10 points**
- Resume has irrelevant bloat/noise: **-5 points**

BONUSES (apply after penalties):
- Each "Nice-to-Have" skill matched: **+2 points** (max +10)
- Exceeds seniority appropriately: **+5 points**

**Step 3: ENFORCE CAPS**
- If ANY critical skill is missing: score CANNOT exceed 75
- Minimum score is 0
- Maximum score is 100

**Step 4: FINAL SCORE RULES**
- DO NOT round to nearest 5 or 10
- Use specific integers like 67, 83, 71, 54
- Show your penalty calculation in gapAnalysis.penaltyCalculation

Extract position title and company name from the JD. Use "Unknown Company" if not found.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Failed to calculate match: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.content[0].text);

    // Save match to database
    const matchId = await ctx.runMutation(api.manualMatches.saveMatch, {
      userId: args.userId,
      rawInput: args.rawInput,
      position: result.position,
      company: result.company,
      fitScore: result.fitScore,
      aiReasoning: result.reasoning,
      keyStrengths: result.keyStrengths,
      potentialChallenges: result.potentialChallenges,
      criticalSkillsFound: result.criticalSkillsFound,
      criticalSkillsMissing: result.criticalSkillsMissing,
      penaltyCalculation: result.penaltyCalculation,
    });

    return {
      matchId,
      position: result.position,
      company: result.company,
      fitScore: result.fitScore,
      aiReasoning: result.reasoning,
      keyStrengths: result.keyStrengths,
      potentialChallenges: result.potentialChallenges,
      criticalSkillsFound: result.criticalSkillsFound,
      criticalSkillsMissing: result.criticalSkillsMissing,
      penaltyCalculation: result.penaltyCalculation,
    };
  },
});

// Save match to database (internal mutation)
export const saveMatch = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const matchId = await ctx.db.insert("manualJobMatches", {
      userId: args.userId,
      rawInput: args.rawInput,
      position: args.position,
      company: args.company,
      fitScore: args.fitScore,
      aiReasoning: args.aiReasoning,
      keyStrengths: args.keyStrengths,
      potentialChallenges: args.potentialChallenges,
      criticalSkillsFound: args.criticalSkillsFound,
      criticalSkillsMissing: args.criticalSkillsMissing,
      penaltyCalculation: args.penaltyCalculation,
      createdAt: Date.now(),
    });

    return matchId;
  },
});

// Get all matches for a user, sorted by fit score (descending)
export const getUserMatches = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const matches = await ctx.db
      .query("manualJobMatches")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Sort by fitScore descending
    matches.sort((a, b) => b.fitScore - a.fitScore);

    return matches;
  },
});

// Delete a match
export const deleteMatch = mutation({
  args: {
    matchId: v.id("manualJobMatches"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.matchId);
  },
});
