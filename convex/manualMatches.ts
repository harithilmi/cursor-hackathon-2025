import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// Declare process for Convex runtime environment
declare const process: { env: Record<string, string | undefined> };

// Scoring weights - fully controlled by code, not LLM
const SCORING_WEIGHTS: Record<string, number> = {
  // BASELINE
  STARTING_SCORE: 100,

  // PENALTIES (Subtractive)
  CRITICAL_SKILL_MISSING: -20,   // Missing a "Must Have" core language/framework
  SECONDARY_SKILL_MISSING: -10,  // Missing a required tool (Docker, Redis, etc.)
  EXPERIENCE_TOO_LOW: -15,       // <75% of required years of experience
  DOMAIN_MISMATCH: -10,          // Never worked in similar industry
  GENERIC_CONTENT: -10,          // Resume lacks numbers/metrics/specifics
  JOB_HOPPER: -5,                // Average tenure <1 year across last 3 jobs
  SENIORITY_MISMATCH: -15,       // Junior applying for Senior, etc.

  // BONUSES (Additive)
  PERFECT_STACK_MATCH: 5,        // Has ALL core tech stack items with evidence
  METRICS_HEAVY: 10,             // >50% of bullets contain specific numbers
  ELITE_COMPANY_MATCH: 5,        // Worked at FAANG or direct competitor
  TRANSITION_EASE: 5,            // Evidence of rapid learning/similar transition
  EXACT_ROLE_MATCH: 5,           // Same job title as the role
};

// Resume gap type for structured output
type ResumeGap = {
  skill: string;
  severity: "CRITICAL" | "MINOR";
  fixStrategy: string;
};

// Action to calculate match using "Ruthless Gatekeeper" system
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
    outcome: "MATCH" | "STRETCH" | "REJECT";
    interviewProbability: number;
    hardRequirementsPassed: boolean;
    failedCriteria: string[];
    resumeGaps: ResumeGap[];
    verdictReasoning: string;
  }> => {
    const apiKey = process.env.ANTHROPIC_API_KEY!;
    if (!apiKey) {
      throw new Error("Anthropic API key not configured");
    }

    // JSON schema for structured output - "Tag-Based Auditor" system
    // LLM outputs boolean FLAGS, code applies weights and calculates score
    const schema = {
      type: "object",
      properties: {
        position: {
          type: "string",
          description: "Job position/title extracted from the job description",
        },
        company: {
          type: "string",
          description: "Company name extracted from the job description. Use 'Unknown' if not found.",
        },
        hardRequirementsPassed: {
          type: "boolean",
          description: "false ONLY if candidate is missing >50% of must-have skills OR experience gap >3 years OR missing mandatory visa/cert",
        },
        failedCriteria: {
          type: "array",
          items: { type: "string" },
          description: "List of hard requirements failed. Empty array [] if passed.",
        },
        detectedFlags: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "CRITICAL_SKILL_MISSING",
              "SECONDARY_SKILL_MISSING",
              "EXPERIENCE_TOO_LOW",
              "DOMAIN_MISMATCH",
              "GENERIC_CONTENT",
              "JOB_HOPPER",
              "SENIORITY_MISMATCH",
              "PERFECT_STACK_MATCH",
              "METRICS_HEAVY",
              "ELITE_COMPANY_MATCH",
              "TRANSITION_EASE",
              "EXACT_ROLE_MATCH",
            ],
          },
          description: "List of applicable flags. Include MULTIPLE of same flag if multiple instances (e.g., 2x CRITICAL_SKILL_MISSING for 2 missing critical skills).",
        },
        flagDetails: {
          type: "string",
          description: "Explain each flag: 'CRITICAL_SKILL_MISSING: No NestJS. CRITICAL_SKILL_MISSING: No Python. METRICS_HEAVY: 4 bullets with numbers.'",
        },
        missingSkillsList: {
          type: "array",
          items: { type: "string" },
          description: "List of specific skills missing from resume that JD requires",
        },
        resumeGaps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              skill: { type: "string" },
              severity: { type: "string", enum: ["CRITICAL", "MINOR"] },
              fixStrategy: { type: "string", description: "Specific action to fix this gap" },
            },
            required: ["skill", "severity", "fixStrategy"],
            additionalProperties: false,
          },
          description: "Specific gaps with actionable fix strategies",
        },
      },
      required: [
        "position",
        "company",
        "hardRequirementsPassed",
        "failedCriteria",
        "detectedFlags",
        "flagDetails",
        "missingSkillsList",
        "resumeGaps",
      ],
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
            content: `You are a Resume Auditor. Your job is to extract BOOLEAN flags from the comparison between a Job Description (JD) and a Resume. You do NOT calculate scores - the code does that.

### JOB DESCRIPTION:
${args.rawInput}

### CANDIDATE RESUME:
${args.resumeContent}

### INSTRUCTIONS

**STEP 1: KILL SWITCH**
Set hardRequirementsPassed = false ONLY if:
- Missing >50% of "Must Have" / "Required" tech stack
- Experience gap > 3 years below minimum required
- Missing mandatory Visa/Location/Certification requirement

If failed, list what failed in failedCriteria. Otherwise, failedCriteria = [].

**STEP 2: DETECT FLAGS**
Analyze the text and output ALL applicable flags in detectedFlags.
Include MULTIPLE instances of the same flag if applicable (e.g., missing 2 critical skills = 2x CRITICAL_SKILL_MISSING).

FLAG DEFINITIONS:

PENALTY FLAGS:
- "CRITICAL_SKILL_MISSING": Candidate is missing a "Must Have" core language/framework (e.g., JD demands Python, Resume has zero Python). Add once PER missing critical skill.
- "SECONDARY_SKILL_MISSING": Candidate is missing a tool listed as required but not the main language (e.g., Missing Docker, Redis, testing library). Add once PER missing secondary skill.
- "EXPERIENCE_TOO_LOW": Candidate has < 75% of required years of experience.
- "DOMAIN_MISMATCH": Candidate has never worked in a similar industry (e.g., JD is Banking, Resume is purely Gaming).
- "GENERIC_CONTENT": Resume bullet points lack numbers, metrics, or specific implementation details.
- "JOB_HOPPER": Candidate has average tenure < 1 year across last 3 jobs.
- "SENIORITY_MISMATCH": Junior applying for Senior role, or vice versa.

BONUS FLAGS:
- "PERFECT_STACK_MATCH": Candidate has extensive evidence for ALL core tech stack items listed as required.
- "METRICS_HEAVY": >50% of bullet points contain specific numbers ($, %, latency, users).
- "ELITE_COMPANY_MATCH": Candidate worked at a top-tier company (FAANG, etc.) or direct competitor.
- "TRANSITION_EASE": Evidence of rapid learning or similar career transition.
- "EXACT_ROLE_MATCH": Candidate has the exact same job title as the role.

**STEP 3: EXPLAIN FLAGS**
In flagDetails, explain each flag briefly:
"CRITICAL_SKILL_MISSING: No NestJS experience found. SECONDARY_SKILL_MISSING: No AWS mentioned. METRICS_HEAVY: Found 5 bullets with specific metrics (40% improvement, 10k users, etc.)."

### RULES
- Extract position and company from JD. Use "Unknown" if not found.
- List all missing skills in missingSkillsList.
- Provide actionable resumeGaps with specific fixStrategy.
- Be strict with flag definitions. Only add a flag if the condition is clearly met.`,
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

    // CODE DOES THE MATH using flag-based scoring
    let interviewProbability: number;
    let outcome: "MATCH" | "STRETCH" | "REJECT";
    let scoreBreakdown: string[] = [];

    if (!result.hardRequirementsPassed) {
      // Kill switch triggered
      interviewProbability = 0;
      outcome = "REJECT";
      scoreBreakdown = ["REJECTED by kill switch"];
    } else {
      // Calculate score from flags - start at 100, apply penalties and bonuses
      let score = SCORING_WEIGHTS.STARTING_SCORE;
      scoreBreakdown.push(`Start: ${score}`);

      // Apply each flag's weight
      const flags: string[] = result.detectedFlags;
      for (const flag of flags) {
        const weight = SCORING_WEIGHTS[flag];
        if (weight !== undefined) {
          score += weight;
          const sign = weight >= 0 ? "+" : "";
          scoreBreakdown.push(`${flag}: ${sign}${weight}`);
        }
      }

      // Clamp between 0 and 100
      interviewProbability = Math.max(0, Math.min(100, score));
      scoreBreakdown.push(`Final: ${interviewProbability}`);

      // Determine outcome based on calculated score
      if (interviewProbability >= 70) {
        outcome = "MATCH";
      } else if (interviewProbability >= 50) {
        outcome = "STRETCH";
      } else {
        outcome = "REJECT";
      }
    }

    // Build verdict with the flag-based calculation
    const verdictReasoning = `${scoreBreakdown.join(" → ")}. ${result.flagDetails}`;

    // Build scores object from flags for UI display
    const flags: string[] = result.detectedFlags || [];
    const scores = {
      // Count penalties
      hardSkillsSum: 50 + (
        flags.filter(f => f === "CRITICAL_SKILL_MISSING").length * SCORING_WEIGHTS.CRITICAL_SKILL_MISSING +
        flags.filter(f => f === "SECONDARY_SKILL_MISSING").length * SCORING_WEIGHTS.SECONDARY_SKILL_MISSING
      ),
      experiencePenalty:
        (flags.includes("EXPERIENCE_TOO_LOW") ? SCORING_WEIGHTS.EXPERIENCE_TOO_LOW : 0) +
        (flags.includes("SENIORITY_MISMATCH") ? SCORING_WEIGHTS.SENIORITY_MISMATCH : 0),
      domainPenalty:
        (flags.includes("DOMAIN_MISMATCH") ? SCORING_WEIGHTS.DOMAIN_MISMATCH : 0) +
        (flags.includes("GENERIC_CONTENT") ? SCORING_WEIGHTS.GENERIC_CONTENT : 0) +
        (flags.includes("JOB_HOPPER") ? SCORING_WEIGHTS.JOB_HOPPER : 0),
      metricsBonus:
        (flags.includes("METRICS_HEAVY") ? SCORING_WEIGHTS.METRICS_HEAVY : 0) +
        (flags.includes("PERFECT_STACK_MATCH") ? SCORING_WEIGHTS.PERFECT_STACK_MATCH : 0),
      techStackBonus:
        (flags.includes("ELITE_COMPANY_MATCH") ? SCORING_WEIGHTS.ELITE_COMPANY_MATCH : 0) +
        (flags.includes("TRANSITION_EASE") ? SCORING_WEIGHTS.TRANSITION_EASE : 0) +
        (flags.includes("EXACT_ROLE_MATCH") ? SCORING_WEIGHTS.EXACT_ROLE_MATCH : 0),
    };

    // Save match to database
    const matchId = await ctx.runMutation(api.manualMatches.saveMatch, {
      userId: args.userId,
      rawInput: args.rawInput,
      position: result.position,
      company: result.company,
      outcome: outcome,
      interviewProbability: interviewProbability,
      hardRequirementsPassed: result.hardRequirementsPassed,
      failedCriteria: result.failedCriteria,
      scores: scores,
      resumeGaps: result.resumeGaps,
      verdictReasoning: verdictReasoning,
    });

    return {
      matchId,
      position: result.position,
      company: result.company,
      outcome: outcome,
      interviewProbability: interviewProbability,
      hardRequirementsPassed: result.hardRequirementsPassed,
      failedCriteria: result.failedCriteria,
      resumeGaps: result.resumeGaps,
      verdictReasoning: verdictReasoning,
    };
  },
});

// Save match to database
export const saveMatch = mutation({
  args: {
    userId: v.id("users"),
    rawInput: v.string(),
    position: v.string(),
    company: v.string(),
    outcome: v.union(v.literal("MATCH"), v.literal("STRETCH"), v.literal("REJECT")),
    interviewProbability: v.number(),
    hardRequirementsPassed: v.boolean(),
    failedCriteria: v.array(v.string()),
    scores: v.object({
      hardSkillsSum: v.number(),
      experiencePenalty: v.number(),
      domainPenalty: v.number(),
      metricsBonus: v.number(),
      techStackBonus: v.number(),
    }),
    resumeGaps: v.array(v.object({
      skill: v.string(),
      severity: v.union(v.literal("CRITICAL"), v.literal("MINOR")),
      fixStrategy: v.string(),
    })),
    verdictReasoning: v.string(),
  },
  handler: async (ctx, args) => {
    const matchId = await ctx.db.insert("manualJobMatches", {
      userId: args.userId,
      rawInput: args.rawInput,
      position: args.position,
      company: args.company,
      outcome: args.outcome,
      interviewProbability: args.interviewProbability,
      hardRequirementsPassed: args.hardRequirementsPassed,
      failedCriteria: args.failedCriteria,
      scores: args.scores,
      resumeGaps: args.resumeGaps,
      verdictReasoning: args.verdictReasoning,
      createdAt: Date.now(),
    });

    return matchId;
  },
});

// Get all matches for a user, sorted by outcome then probability
export const getUserMatches = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const matches = await ctx.db
      .query("manualJobMatches")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Sort by outcome priority (MATCH > STRETCH > REJECT), then by probability
    // Records without outcome (legacy) go to the end
    const outcomePriority: Record<string, number> = { MATCH: 0, STRETCH: 1, REJECT: 2 };
    matches.sort((a, b) => {
      // Legacy records without outcome go last
      const aOutcome = a.outcome;
      const bOutcome = b.outcome;
      if (!aOutcome && !bOutcome) return 0;
      if (!aOutcome) return 1;
      if (!bOutcome) return -1;

      const priorityDiff = (outcomePriority[aOutcome] ?? 3) - (outcomePriority[bOutcome] ?? 3);
      if (priorityDiff !== 0) return priorityDiff;
      return (b.interviewProbability ?? 0) - (a.interviewProbability ?? 0);
    });

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

// Delete all matches for a user (used for migration)
export const deleteAllUserMatches = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const matches = await ctx.db
      .query("manualJobMatches")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const match of matches) {
      await ctx.db.delete(match._id);
    }

    return { deleted: matches.length };
  },
});
