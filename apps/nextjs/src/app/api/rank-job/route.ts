import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface RankJobRequest {
  resumeContent: string;
  jobDescription: string;
  jobPosition: string;
  jobCompany: string;
}

interface JobRanking {
  fitScore: number;
  reasoning: string;
  keyStrengths: string[];
  potentialChallenges: string[];
}

export async function POST(request: Request) {
  try {
    const { resumeContent, jobDescription, jobPosition, jobCompany } =
      (await request.json()) as RankJobRequest;

    if (!resumeContent || !jobDescription) {
      return NextResponse.json(
        { error: "Resume content and job description are required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 },
      );
    }

    // Define the JSON schema for structured output
    const schema = {
      type: "object",
      properties: {
        fitScore: {
          type: "number",
          description:
            "A score from 0-100 indicating how well the candidate fits the job",
        },
        reasoning: {
          type: "string",
          description:
            "Detailed explanation of the fit score, analyzing candidate's experience against job requirements",
        },
        keyStrengths: {
          type: "array",
          items: { type: "string" },
          description:
            "List of 3-5 key strengths that make the candidate a good fit",
        },
        potentialChallenges: {
          type: "array",
          items: { type: "string" },
          description:
            "List of 2-3 areas where the candidate might face challenges or needs growth",
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
            content: `You are an expert job matching AI. Analyze how well this candidate's resume fits the job posting.

Job Position: ${jobPosition}
Company: ${jobCompany}

Job Description:
${jobDescription}

Candidate's Resume:
${resumeContent}

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
      return NextResponse.json(
        { error: "Failed to rank job" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Extract the structured output
    const ranking: JobRanking = JSON.parse(data.content[0].text);

    return NextResponse.json(ranking);
  } catch (error) {
    console.error("Error ranking job:", error);
    return NextResponse.json(
      { error: "Failed to rank job" },
      { status: 500 },
    );
  }
}
