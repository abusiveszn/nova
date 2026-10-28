# Vercel Deployment Guide

## Quick Start

Your project is configured to deploy on Vercel with both frontend and backend in a single deployment.

## Prerequisites

1. GitHub account (for connecting repository)
2. Vercel account (free tier works)
3. SendGrid account (for email verification - optional, can use mock in dev)

## Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit with Investor Portal"

# Create a new repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/nova-ai.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Select **Import Git Repository**
4. Search for and select your `nova-ai` repository
5. Click **Import**

### Step 3: Configure Environment Variables in Vercel

In the Vercel project settings, go to **Settings → Environment Variables** and add:

#### Production Variables (for production deployment):
```
SITE_URL=https://your-project-name.vercel.app
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@nova-ai.com
ALLOW_LOCAL_EMAIL=false
```

#### Preview/Development Variables:
```
SITE_URL=https://[deployment-url].vercel.app
```

### Step 4: Deploy

1. Click **Deploy** - Vercel will automatically:
   - Install dependencies
   - Run `npm run build`
   - Build frontend (Vite → dist/)
   - Bundle backend API handlers
   - Deploy everything to Vercel's infrastructure

2. Your site will be live at: `https://your-project-name.vercel.app`

## What Gets Deployed

```
Frontend:
  └─ Vite build output in /dist
     └─ Hosted as static site + SPA routing

Backend API:
  └─ /api handlers converted to Vercel Serverless Functions
     ├─ /api/send-code (POST)
     └─ /api/verify-code (POST)

Database/Storage:
  └─ Uses localStorage in browser (data persists per device)
```

## Accessing Your App

- **Frontend**: https://your-project-name.vercel.app
- **API Endpoints**: 
  - https://your-project-name.vercel.app/api/send-code
  - https://your-project-name.vercel.app/api/verify-code

## Important Notes

### 1. API Base URL Configuration

In `src/components/AuthPage.tsx`, the API base URL is automatically set:
- **Development**: Points to `http://localhost:4001` (Express server)
- **Production**: Points to empty string (same domain)

```typescript
const API_BASE = import.meta.env.DEV ? "http://localhost:4001" : "";
```

This means in production, requests go to: `https://your-domain.vercel.app/api/...`

### 2. Email Verification in Production

For emails to work in production, you MUST set up SendGrid:

1. Create a SendGrid account (free tier available)
2. Get your API key from Settings → API Keys
3. Add `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` to Vercel environment variables
4. Update `SITE_URL` to your actual Vercel domain

### 3. Local Development

To run locally before deployment:
```bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local with your values
# For local testing: SENDGRID_API_KEY can be left empty (dev mode works)

# Start development
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:4001
```

### 4. Database/Storage

Currently uses browser `localStorage`. If you need persistent storage:
- Add a real database (MongoDB, PostgreSQL, etc.)
- Update AppContext to fetch/save from database instead of localStorage
- Add database connection string to Vercel environment variables

## Vercel Configuration Files

- **vercel.json** - Deployment configuration
  - Specifies build command and output directory
  - Configures API routes as serverless functions
  - Sets up SPA routing

- **.vercelignore** - Files to exclude from deployment
  - Reduces deployment bundle size
  - Excludes dev dependencies, git history, etc.

- **package.json** - Specifies Node.js version (24.x)
  - Ensures consistent runtime across environments

## Troubleshooting

### Build Fails
```
Error: Cannot find module '@/...'
```
**Solution**: Make sure tsconfig paths are correct in `tsconfig.json`

### API Endpoints Return 404
```
Solution: 
1. Check vercel.json routes configuration
2. Ensure /api handlers exist and export default function
3. Verify SITE_URL is set in production
```

### Email Not Sending
```
Solution:
1. Set SENDGRID_API_KEY in Vercel environment variables
2. Verify SENDGRID_FROM_EMAIL is correct
3. Check Vercel function logs for errors
```

### Auth Issues in Production
```
Solution:
1. Ensure SITE_URL matches your Vercel domain exactly
2. Clear browser localStorage and try again
3. Check email link in verification email includes correct domain
```

## Monitoring & Logs

View your deployment logs in Vercel dashboard:
1. Go to your project in Vercel
2. Click **Deployments**
3. Click on the latest deployment
4. View **Function Logs** for API errors

## Custom Domain

To use a custom domain:
1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `SITE_URL` environment variable to use custom domain

## Next Steps

1. ✅ Code is ready - just push to GitHub
2. ✅ Vercel.json configured - Vercel knows how to build
3. ✅ Environment variables documented
4. 🔄 Complete deployment workflow:
   - Push to GitHub
   - Vercel auto-deploys
   - Share your live URL!

---

**Questions?** Check Vercel docs: https://vercel.com/docs
