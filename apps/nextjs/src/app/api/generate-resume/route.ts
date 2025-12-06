import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface GenerateResumeRequest {
  resumeContent: string;
  jobDescription: string;
  jobPosition: string;
  jobCompany: string;
}

interface TailoredResume {
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    achievements: string[];
  }>;
  skills: string[];
  education: string[];
  additionalSections?: Array<{
    title: string;
    content: string[];
  }>;
}

export async function POST(request: Request) {
  try {
    const { resumeContent, jobDescription, jobPosition, jobCompany } =
      (await request.json()) as GenerateResumeRequest;

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
        summary: {
          type: "string",
          description:
            "A compelling 2-3 sentence professional summary tailored to this specific job",
        },
        experience: {
          type: "array",
          items: {
            type: "object",
            properties: {
              company: { type: "string" },
              position: { type: "string" },
              duration: { type: "string" },
              achievements: {
                type: "array",
                items: { type: "string" },
                description:
                  "3-5 achievement bullet points that highlight relevant accomplishments for this job",
              },
            },
            required: ["company", "position", "duration", "achievements"],
          },
        },
        skills: {
          type: "array",
          items: { type: "string" },
          description:
            "List of most relevant skills for this job, prioritized by importance",
        },
        education: {
          type: "array",
          items: { type: "string" },
          description: "Education entries formatted as complete strings",
        },
        additionalSections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["title", "content"],
          },
          description:
            "Optional sections like certifications, projects, or awards if relevant to the job",
        },
      },
      required: ["summary", "experience", "skills", "education"],
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
        model: "claude-sonnet-4-5-20250924",
        max_tokens: 4096,
        temperature: 0.5,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "tailored_resume",
            strict: true,
            schema: schema,
          },
        },
        messages: [
          {
            role: "user",
            content: `You are an expert resume writer. Create a tailored resume for this specific job application.

Job Position: ${jobPosition}
Company: ${jobCompany}

Job Description:
${jobDescription}

Candidate's Full Resume (Dump):
${resumeContent}

Generate a tailored resume that:
1. Highlights the most relevant experiences and achievements for THIS specific job
2. Uses keywords from the job description naturally
3. Quantifies achievements with metrics where possible
4. Emphasizes skills that match the job requirements
5. Removes or de-emphasizes irrelevant experiences
6. Maintains truthfulness - only use information from the original resume

The tailored resume should be optimized for both ATS (Applicant Tracking Systems) and human recruiters. Focus on impact and relevance to this specific role.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      return NextResponse.json(
        { error: "Failed to generate resume" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Extract the structured output
    const tailoredResume: TailoredResume = JSON.parse(data.content[0].text);

    return NextResponse.json(tailoredResume);
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 },
    );
  }
}
