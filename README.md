# KerjaFlow

> A smart job application assistant for Malaysian job seekers powered by AI

KerjaFlow is a web application that helps you find, rank, and apply to jobs from Malaysian job sites (Hiredly only for now). It scrapes job listings, ranks them based on how well they match your resume, and helps you tailor your resume and cover letter for each specific job. Generate professional resume PDFs and AI-written cover letters.

## Features

### Core Features
- 🔍 **Job Scraping** - Automatically scrape job listings from Hiredly using Apify
- 🤖 **AI-Powered Ranking** - Real-time parallel job ranking with fit scores (0-100%)
- 📄 **Master Dump Resume** - Paste your entire career history once, we tailor it for each job
- ✨ **Custom Resume Generation** - AI generates tailored resumes highlighting relevant experience
- ✉️ **Cover Letter Writing** - AI-generated cover letters based on job requirements
- 📥 **PDF Export** - Download professional resume PDFs
- 🔗 **Direct Application Links** - One-click access to apply on Hiredly
- ⚡ **Real-time Updates** - Live progress tracking for scraping and ranking via Convex

### UI/UX
- 🌙 **Dark Glassmorphism Theme** - Modern dark UI with glass effects and gradient accents
- 📊 **Live Progress Tracking** - Visual milestones during job scraping
- 🎯 **Match Indicators** - Color-coded fit scores (green for high match, indigo for medium)

## User Flow

1. **Landing Page** - Sign in with Google via Clerk
2. **Master Dump** - Paste your entire career history (skills, experience, projects)
3. **Job Search** - Enter job title (e.g., "Frontend Developer")
4. **Scraping** - Watch real-time progress as jobs are scraped from Hiredly
5. **AI Ranking** - Jobs automatically ranked by fit score with reasoning
6. **View Results** - Browse ranked jobs with match percentages
7. **Generate Documents** - Create tailored resume and cover letter for selected job
8. **Download & Apply** - Export PDF and apply via Hiredly link

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Convex** - Real-time backend with live subscriptions
- **Clerk** - Google OAuth authentication
- **Claude Sonnet** - AI for ranking, resume tailoring, and cover letters
- **Apify** - Cloud web scraping for job listings
- **Tailwind CSS** - Dark glassmorphism styling
- **TypeScript** - Type safety throughout

## Installation

### Prerequisites
- Node.js 22+
- pnpm package manager
- Apify account (for job scraping)
- Anthropic API key (for Claude)
- Convex account (for backend)
- Clerk account (for authentication)

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

   # Anthropic Claude
   ANTHROPIC_API_KEY=your_anthropic_key

   # Convex
   CONVEX_DEPLOYMENT=your_convex_deployment
   NEXT_PUBLIC_CONVEX_URL=your_convex_url

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Set up Convex**
   ```bash
   npx convex dev
   ```

5. **Start development server**
   ```bash
   pnpm dev:next
   ```

   The app will be available at `http://localhost:3000`

## Project Structure

```text
.
├── apps/
│   └── nextjs/                    # Next.js web application
│       └── src/
│           └── app/
│               ├── api/
│               │   ├── search-jobs/        # Job scraping endpoint
│               │   ├── rank-job/           # AI job ranking endpoint
│               │   ├── generate-resume/    # Resume generation endpoint
│               │   ├── generate-cover-letter/  # Cover letter endpoint
│               │   └── generate-pdf/       # PDF export endpoint
│               ├── kerjaflow/
│               │   └── _components/        # UI components
│               │       ├── login-view.tsx
│               │       ├── search-view.tsx
│               │       ├── results-view.tsx
│               │       ├── job-card.tsx
│               │       ├── generator-view.tsx
│               │       └── resume-dump-view.tsx
│               ├── dump/                   # Master dump page
│               ├── search/                 # Job search page
│               ├── results/                # Results page
│               ├── jobs/[jobId]/           # Job details page
│               └── generate/               # Document generator page
├── my-actor/                      # Apify Actor for web scraping
│   └── src/
│       └── main.ts                # Scraper with Claude structured outputs
├── convex/                        # Convex backend functions
│   ├── jobs.ts                    # Job listing management
│   ├── rankings.ts                # AI ranking storage
│   ├── resumes.ts                 # Resume management
│   ├── users.ts                   # User data
│   └── schema.ts                  # Database schema
├── tooling/
│   └── tailwind/
│       └── theme.css              # Dark theme CSS variables
└── packages/
    └── ui/                        # Shared UI components
```

## How It Works

### Job Scraping Pipeline

1. **User searches** for a job (e.g., "software engineer")
2. **Next.js API** calls Apify Actor via cloud API
3. **Apify Actor** (running in cloud):
   - Navigates to Hiredly job listings
   - Extracts job detail pages
   - Uses Claude AI with structured outputs to parse job data
4. **Jobs saved** to Convex database
5. **Real-time updates** pushed to client via Convex subscriptions

### AI Ranking Pipeline

1. **Jobs fetched** from Convex after scraping completes
2. **Parallel ranking** - Multiple jobs ranked simultaneously
3. **Claude analyzes** each job against user's master dump resume
4. **Fit scores** (0-100%) calculated with reasoning
5. **Rankings saved** to Convex, UI updates in real-time
6. **Results sorted** by fit score (highest first)

### AI-Powered Features (Claude Sonnet)

- **Structured Outputs** - 100% valid JSON extraction from job listings
- **Job Ranking** - Fit score with key strengths and potential challenges
- **Resume Tailoring** - AI rewrites experience to match job requirements
- **Cover Letter Writing** - Personalized letters based on job description
- **PDF Generation** - Professional resume PDFs for download

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
Search and scrape jobs from Hiredly, save to Convex.

### POST `/api/rank-job`
Rank a single job against user's resume using Claude AI.

**Response:**
```json
{
  "fitScore": 85,
  "reasoning": "Strong match due to...",
  "keyStrengths": ["React experience", "Team leadership"],
  "potentialChallenges": ["No Go experience mentioned"]
}
```

### POST `/api/generate-resume`
Generate tailored resume content using Claude AI.

### POST `/api/generate-cover-letter`
Generate personalized cover letter using Claude AI.

### POST `/api/generate-pdf`
Export resume as PDF document.

## Performance

- **Job scraping**: ~1-2 minutes for 5 jobs (includes AI parsing)
- **AI ranking**: Parallel processing, ~5-10 seconds per job
- **Real-time updates**: Instant UI updates via Convex subscriptions
- **Structured outputs**: 100% valid JSON, no retries needed

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
