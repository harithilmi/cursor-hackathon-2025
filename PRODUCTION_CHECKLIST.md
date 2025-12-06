# Production Checklist

⚠️ **IMPORTANT: Complete these tasks before deploying to production**

## Environment Variables

### Required for Production

1. **Discord OAuth Credentials** (Better Auth)
   ```
   AUTH_DISCORD_ID='your-actual-discord-client-id'
   AUTH_DISCORD_SECRET='your-actual-discord-client-secret'
   ```
   - Currently set to 'placeholder' in `.env`
   - Get from: https://discord.com/developers/applications
   - Create a new application → OAuth2 → Add redirect URL: `https://yourdomain.com/api/auth/callback/discord`

2. **Google OAuth Credentials** (Better Auth)
   ```
   AUTH_GOOGLE_ID='your-google-client-id'
   AUTH_GOOGLE_SECRET='your-google-client-secret'
   ```
   - Get from: https://console.cloud.google.com/apis/credentials
   - Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`

3. **Database Connection**
   - Current Supabase URL appears to have connection issues
   - Verify `POSTGRES_URL` is correct and accessible from production
   - Consider using a pooled connection string for Better Auth

4. **Better Auth Secret**
   - Change `supersecret` to a secure random string
   - Generate with: `openssl rand -base64 32`

## Security

- [ ] Remove API keys from `.env` and use environment-specific secrets
- [ ] Enable CORS properly for production domains
- [ ] Add rate limiting to API routes (especially AI endpoints)
- [ ] Review and update `trustedOrigins` in Better Auth config
- [ ] Enable HTTPS/SSL certificates
- [ ] Secure Convex deployment with proper authentication

## API Rate Limits & Costs

- [ ] Set up API usage monitoring for:
  - Anthropic API (Claude Sonnet 4.5)
  - Apify (job scraping)
  - Convex (database operations)
- [ ] Implement user-level rate limiting to prevent abuse
- [ ] Add error handling for API quota exceeded

## Database

- [ ] Run database migrations (if any)
- [ ] Set up database backups
- [ ] Configure database indexes for production scale
- [ ] Test Convex deployment is accessible from production

## Code Issues to Fix

### Missing Dependencies
The `@kerjaflow/db` package has TypeScript errors:
```
src/client.ts(1,22): error TS2307: Cannot find module 'postgres'
src/schema.ts(3,36): error TS2307: Cannot find module 'drizzle-zod'
```

**Fix**: Since you're using Convex (not Postgres), you can either:
1. Install missing packages: `cd packages/db && pnpm add postgres drizzle-zod`
2. Remove the `@kerjaflow/db` package if not needed

## Testing

- [ ] Test all three AI API routes:
  - `/api/rank-job`
  - `/api/generate-resume`
  - `/api/generate-cover-letter`
- [ ] Test job scraping with Apify
- [ ] Test Convex database operations
- [ ] Test authentication flow (Discord, Google)
- [ ] Test on different browsers and devices

## Performance

- [ ] Optimize API routes (add caching if appropriate)
- [ ] Set up CDN for static assets
- [ ] Configure proper timeout limits (currently 60s for AI routes, 300s for job scraping)
- [ ] Monitor and optimize Claude API token usage

## Monitoring & Logging

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure application logging
- [ ] Set up uptime monitoring
- [ ] Create alerts for API failures

## Deployment Checklist

- [ ] Set up CI/CD pipeline
- [ ] Configure production environment variables
- [ ] Test deployment in staging environment first
- [ ] Set up database backups and disaster recovery
- [ ] Document deployment process
- [ ] Create rollback plan

## Legal & Compliance

- [ ] Add privacy policy (collecting user data via OAuth)
- [ ] Add terms of service
- [ ] Ensure compliance with data protection regulations (GDPR, etc.)
- [ ] Review Hiredly's terms of service for web scraping

## Notes

### Current Development Configuration

**Temporary/Development Values:**
- Discord credentials: `placeholder` (needs real values)
- Better Auth secret: `supersecret` (needs secure value)
- Supabase connection: May have network issues

**Working Services:**
- ✅ Convex backend deployed
- ✅ Anthropic API configured
- ✅ Apify API configured
- ✅ All API routes created

### Architecture Decisions

- **Data Storage**: Using Convex (not Postgres/Supabase for main app data)
- **Authentication**: Better Auth with Discord & Google OAuth
- **AI Processing**: Claude Sonnet 4.5 via Next.js API routes (not Convex actions)
- **Job Scraping**: Apify actor for Hiredly job listings

### API Route Details

All AI routes use:
- Model: `claude-sonnet-4-5`
- Feature: Anthropic Structured Outputs (beta)
- Timeout: 60 seconds
- Runtime: Node.js

Job scraping route uses:
- Timeout: 300 seconds (5 minutes)
- Actor: `cashmere_quarter/hiredly-job-scraper`
