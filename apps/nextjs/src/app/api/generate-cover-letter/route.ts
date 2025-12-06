import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface GenerateCoverLetterRequest {
  resumeContent: string;
  jobDescription: string;
  jobPosition: string;
  jobCompany: string;
}

interface CoverLetter {
  opening: string;
  bodyParagraphs: string[];
  closing: string;
  fullText: string;
}

export async function POST(request: Request) {
  try {
    const { resumeContent, jobDescription, jobPosition, jobCompany } =
      (await request.json()) as GenerateCoverLetterRequest;

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
        opening: {
          type: "string",
          description:
            "The opening paragraph that grabs attention and states the position being applied for",
        },
        bodyParagraphs: {
          type: "array",
          items: { type: "string" },
          description:
            "2-3 body paragraphs that highlight relevant experience, skills, and why the candidate is a great fit. Must include at least 2 paragraphs.",
        },
        closing: {
          type: "string",
          description:
            "The closing paragraph that expresses enthusiasm and includes a call to action",
        },
        fullText: {
          type: "string",
          description:
            "The complete cover letter as a single formatted text, ready to be used",
        },
      },
      required: ["opening", "bodyParagraphs", "closing", "fullText"],
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
        model: "claude-haiku-4-5",
        max_tokens: 3072,
        temperature: 0.7,
        output_format: {
          type: "json_schema",
          schema: schema,
        },
        messages: [
          {
            role: "user",
            content: `You are an expert career coach and cover letter writer. Create a compelling, personalized cover letter for this job application.

Job Position: ${jobPosition}
Company: ${jobCompany}

Job Description:
${jobDescription}

Candidate's Resume:
${resumeContent}

Write a professional cover letter that:
1. Opens with a strong hook that shows enthusiasm and understanding of the company/role
2. Highlights 2-3 specific experiences or achievements that directly relate to the job requirements
3. Demonstrates knowledge of the company and explains why the candidate wants to work there specifically
4. Shows personality while maintaining professionalism
5. Includes specific examples with quantifiable results where possible
6. Closes with confidence and a clear call to action
7. Is concise (300-400 words total)
8. Uses natural, conversational tone while being professional
9. Avoids clichés and generic statements

The cover letter should feel personal, authentic, and tailored specifically to this job and company. Only use information from the provided resume.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      return NextResponse.json(
        { error: "Failed to generate cover letter" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Extract the structured output
    const coverLetter: CoverLetter = JSON.parse(data.content[0].text);

    return NextResponse.json(coverLetter);
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 },
    );
  }
}
