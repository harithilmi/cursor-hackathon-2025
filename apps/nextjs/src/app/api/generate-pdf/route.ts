import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface GeneratePDFRequest {
  userName: string;
  userEmail: string;
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
    const data = (await request.json()) as GeneratePDFRequest;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size

    // Embed fonts
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

    const { width, height } = page.getSize();
    let yPosition = height - 50;
    const margin = 50;
    const lineHeight = 14;

    // Helper function to draw text with word wrap
    const drawText = (
      text: string,
      fontSize: number,
      font: any,
      color = rgb(0, 0, 0),
      bold = false
    ) => {
      const maxWidth = width - 2 * margin;
      const words = text.split(" ");
      let line = "";

      for (const word of words) {
        const testLine = line + word + " ";
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > maxWidth && line !== "") {
          page.drawText(line.trim(), {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: bold ? timesRomanBoldFont : font,
            color,
          });
          yPosition -= lineHeight;
          line = word + " ";
        } else {
          line = testLine;
        }
      }

      if (line.trim() !== "") {
        page.drawText(line.trim(), {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: bold ? timesRomanBoldFont : font,
          color,
        });
        yPosition -= lineHeight;
      }
    };

    const drawLine = () => {
      page.drawLine({
        start: { x: margin, y: yPosition },
        end: { x: width - margin, y: yPosition },
        thickness: 1,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPosition -= 15;
    };

    // Header - Name and Contact
    page.drawText(data.userName.toUpperCase(), {
      x: margin,
      y: yPosition,
      size: 24,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 25;

    page.drawText(data.userEmail, {
      x: margin,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPosition -= 20;

    drawLine();

    // Professional Summary
    page.drawText("PROFESSIONAL SUMMARY", {
      x: margin,
      y: yPosition,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 18;

    drawText(data.summary, 10, timesRomanFont);
    yPosition -= 10;

    // Experience
    page.drawText("EXPERIENCE", {
      x: margin,
      y: yPosition,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 18;

    for (const exp of data.experience) {
      // Check if we need a new page
      if (yPosition < 100) {
        const newPage = pdfDoc.addPage([595, 842]);
        yPosition = height - 50;
      }

      page.drawText(`${exp.position} at ${exp.company}`, {
        x: margin,
        y: yPosition,
        size: 11,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 14;

      page.drawText(exp.duration, {
        x: margin,
        y: yPosition,
        size: 9,
        font: timesRomanFont,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 16;

      for (const achievement of exp.achievements) {
        drawText(`• ${achievement}`, 9, timesRomanFont);
      }
      yPosition -= 8;
    }

    // Skills
    yPosition -= 5;
    page.drawText("SKILLS", {
      x: margin,
      y: yPosition,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 18;

    const skillsText = data.skills.join(" • ");
    drawText(skillsText, 10, timesRomanFont);
    yPosition -= 10;

    // Education
    page.drawText("EDUCATION", {
      x: margin,
      y: yPosition,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 18;

    for (const edu of data.education) {
      drawText(edu, 10, timesRomanFont);
    }

    // Additional Sections
    if (data.additionalSections && data.additionalSections.length > 0) {
      for (const section of data.additionalSections) {
        yPosition -= 10;
        page.drawText(section.title.toUpperCase(), {
          x: margin,
          y: yPosition,
          size: 12,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 18;

        for (const item of section.content) {
          drawText(`• ${item}`, 10, timesRomanFont);
        }
      }
    }

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Return PDF as response
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${data.userName.replace(/\s+/g, "-")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
