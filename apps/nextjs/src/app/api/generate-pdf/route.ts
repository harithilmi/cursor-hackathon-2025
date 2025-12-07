import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

interface GeneratePDFRequest {
  resumeContent: string;
  jobDescription: string;
  jobPosition: string;
  jobCompany: string;
}

export async function POST(request: Request) {
  try {
    const { resumeContent, jobDescription, jobPosition, jobCompany } =
      (await request.json()) as GeneratePDFRequest;

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

    // Generate pure LaTeX from Claude
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `Generate LaTeX code for a professional one-page resume. Output ONLY valid LaTeX code starting with \\documentclass, nothing else before or after.

TARGET POSITION: ${jobPosition} at ${jobCompany}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE INFO:
${resumeContent}

STRICT REQUIREMENTS:
1. Start with: \\documentclass[11pt,a4paper]{article}
2. Use ONLY these packages: geometry, enumitem, titlesec, parskip
3. Set margins: \\usepackage[margin=0.5in]{geometry}
4. NO hyperref, NO fontenc, NO inputenc, NO special fonts
5. Use \\textbf for bold, \\textit for italic only
6. For bullets use: \\begin{itemize}[leftmargin=*,nosep] ... \\end{itemize}
7. ESCAPE all special characters: & → \\& , % → \\% , $ → \\$ , # → \\# , _ → \\_
8. NO unicode characters - ASCII only
9. Keep to ONE page

Structure:
- Header: Name (large, bold), contact on one line below
- Summary: 2-3 sentences
- Experience: 3-4 roles with bullet points
- Skills: comma-separated list
- Education: degree, school, year

Output the complete LaTeX document ready to compile.`,
        },
      ],
    });

    // Get pure LaTeX output
    let latex = (message.content[0] as { type: "text"; text: string }).text;

    // Clean markdown code blocks if present
    latex = latex
      .replace(/```latex\n?/gi, "")
      .replace(/```\n?/g, "")
      .trim();

    // Ensure it starts with documentclass
    if (!latex.startsWith("\\documentclass")) {
      const docClassIndex = latex.indexOf("\\documentclass");
      if (docClassIndex > 0) {
        latex = latex.substring(docClassIndex);
      }
    }

    console.log("Generated LaTeX (first 500 chars):", latex.substring(0, 500));

    // Try latex.ytotech.com first (more reliable)
    let pdfResponse = await fetch("https://latex.ytotech.com/builds/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        compiler: "pdflatex",
        resources: [
          {
            main: true,
            content: latex,
          },
        ],
      }),
    });

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error("YtoTech LaTeX compile error:", errorText);

      // Fallback to latexonline.cc
      console.log("Trying fallback: latexonline.cc");
      pdfResponse = await fetch(
        `https://latexonline.cc/compile?text=${encodeURIComponent(latex)}`,
        { headers: { Accept: "application/pdf" } },
      );

      if (!pdfResponse.ok) {
        const fallbackError = await pdfResponse.text();
        console.error("LaTeXOnline compile error:", fallbackError);
        throw new Error("Failed to compile LaTeX with both services");
      }
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    // Verify it's actually a PDF
    if (pdfBuffer.length < 100 || !pdfBuffer.toString("utf8", 0, 5).includes("%PDF")) {
      console.error("Response is not a valid PDF, length:", pdfBuffer.length);
      console.error("Response content:", pdfBuffer.toString("utf8", 0, 200));
      throw new Error("Invalid PDF response from LaTeX compiler");
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Resume_${jobCompany.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
