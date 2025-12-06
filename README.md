# KerjaFlow

> A smart job application assistant for Malaysian job seekers powered by AI

KerjaFlow is a web application that helps you find, rank, and apply to jobs from Malaysian job sites (Hiredly only for now). It scrapes job listings, ranks them based on how well they match your resume, and helps you tailor your resume and cover letter for each specific job. Generate professional resume PDFs with LaTeX and AI-written cover letters.

## Features

### Core Features
- 🔍 **Job Scraping** - Automatically scrape job listings from Hiredly
- 🤖 **AI-Powered Ranking** - Rank jobs based on how well they match your resume
- 📄 **Custom Resume Generation** - Generate tailored resumes for each job using PDFLaTeX
- ✉️ **Cover Letter Writing** - AI-generated cover letters based on your input and the job description
- 🔗 **Direct Application Links** - One-click access to apply on the original job site

### Future Enhancements (If More Time)
- 🚩 **Red Flags Detection** - Identify potentially problematic job postings
- 🎯 **BS Detector** - Detect misleading or exaggerated job descriptions

## User Flow

1. **Landing Page** - Learn about KerjaFlow features
2. **Login with Google** - Sign in with Google authentication
3. **Upload Resume** - Paste your "dump" resume (all your experiences), upload a file, or skip
4. **Dashboard** - Navigate to your personalized dashboard
5. **Job Search** - Input job title (e.g., "react developer")
6. **View Rankings** - Jobs automatically ranked according to your resume fit
7. **Generate Resume** - Create a customized resume PDF for each specific job
8. **Write Cover Letter** - Generate tailored cover letters (optional)
9. **Apply** - Click the link to the job site to submit your application

## Tech Stack

- **Next.js** - React framework with App Router
- **Convex** - Backend platform for real-time data and serverless functions
- **Claude Sonnet 4.5** - AI for resume and cover letter generation/tailoring
- **Apify** - Web scraping platform for job listings
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Better Auth** - Google OAuth authentication
- **PDFLaTeX** - Professional resume PDF generation

## Installation

### Prerequisites
- Node.js 22+
- pnpm package manager
- Apify account (for job scraping)
- Anthropic API key (for Claude Sonnet 4.5)
- Convex account (for backend)
- PDFLaTeX installed (for resume PDF generation)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cursor-hackathon-2025
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   # Apify
   APIFY_API_TOKEN=your_apify_token

   # Anthropic Claude Sonnet 4.5
   ANTHROPIC_API_KEY=your_anthropic_key

   # Convex
   CONVEX_DEPLOYMENT=your_convex_deployment
   NEXT_PUBLIC_CONVEX_URL=your_convex_url

   # Authentication
   BETTER_AUTH_SECRET=your_secret
   BETTER_AUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Set up Convex**
   ```bash
   npx convex dev
   ```

5. **Generate Better Auth schema**
   ```bash
   pnpm --filter @kerjaflow/auth generate
   ```

6. **Start development server**
   ```bash
   pnpm dev:next
   ```

   The app will be available at `http://localhost:3000`

## Project Structure

```text
.
├── apps/
│   └── nextjs/          # Next.js web application
│       └── src/
│           └── app/
│               ├── api/
│               │   └── search-jobs/  # Job scraping API endpoint
│               ├── jobs/             # Job search and listing pages
│               └── dashboard/        # User dashboard
├── my-actor/            # Apify Actor for web scraping
│   └── src/
│       └── main.ts      # Scraper with Claude structured outputs
├── convex/              # Convex backend functions
│   ├── jobs.ts          # Job-related functions
│   ├── resumes.ts       # Resume management
│   └── users.ts         # User data
└── packages/
    ├── auth/            # Better Auth with Google OAuth
    └── ui/              # Shared UI components
```

## How It Works

### Job Scraping Pipeline

1. **User searches** for a job (e.g., "software engineer")
2. **Next.js API** calls Apify Actor via cloud API
3. **Apify Actor** (running in cloud):
   - Navigates to Hiredly job listings
   - Extracts job detail pages
   - Uses Claude AI with structured outputs to parse:
     - Position name
     - Company name
     - Location
     - Full job description
     - Salary (if available)
4. **Results returned** to Next.js app
5. **Jobs displayed** with AI-powered ranking

### AI-Powered Features (Claude Sonnet 4.5)

- **Structured Outputs** - Claude's beta feature ensures 100% valid JSON extraction from job listings
- **Job Ranking** - Analyzes your "dump" resume against job requirements and ranks by fit score
- **Resume Tailoring** - Generates custom resumes highlighting relevant experience for each specific job
- **Cover Letter Writing** - Creates personalized, professional cover letters based on your input
- **PDF Generation** - Converts tailored resumes to professional PDFs using LaTeX

## Development

### Running the Apify Actor Locally

```bash
cd my-actor
npm install
apify run
```

### Deploying the Apify Actor

```bash
cd my-actor
apify login
apify push
```

Make sure to set `ANTHROPIC_API_KEY` as a secret environment variable in Apify Console.

### Running Tests

```bash
pnpm test
```

## API Endpoints

### POST `/api/search-jobs`

Search and scrape jobs from Hiredly.

**Request:**
```json
{
  "searchTerm": "software engineer"
}
```

**Response:**
```json
{
  "jobs": [
    {
      "url": "https://...",
      "position": "Software Engineer",
      "company": "Company Name",
      "location": "Kuala Lumpur, Malaysia",
      "description": "Full job description...",
      "salary": "RM 5,000 - RM 8,000"
    }
  ],
  "totalFound": 5
}
```

## Performance

- **Job scraping**: ~5-10 minutes for 5 jobs (includes AI parsing)
- **Structured outputs**: 100% valid JSON, no retries needed
- **Rate limiting**: Handles Hiredly's rate limits gracefully

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your chosen license]

## Acknowledgments

- Built with [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo)
- Powered by [Apify](https://apify.com/) for web scraping
- AI by [Anthropic Claude](https://www.anthropic.com/)
- Hosted on [Vercel](https://vercel.com/)

---

Built for Cursor Hackathon 2025 🚀
