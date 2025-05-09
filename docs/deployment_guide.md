# TasteMongers Deployment Guide

This guide provides detailed instructions for deploying the TasteMongers website to Vercel with Vercel Postgres.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Vercel Deployment](#vercel-deployment)
   - [GitHub Integration](#github-integration)
   - [Manual Deployment](#manual-deployment)
4. [Database Setup](#database-setup)
   - [Vercel Postgres Setup](#vercel-postgres-setup)
   - [Running Migrations](#running-migrations)
5. [Environment Variables](#environment-variables)
6. [Deployment Troubleshooting](#deployment-troubleshooting)

## Prerequisites

- Node.js 18+ and npm
- Git
- Vercel account
- GitHub account (recommended)

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tastemongers
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the database connection details:
   ```
   POSTGRES_URL="postgres://username:password@localhost:5432/tastemongers"
   POSTGRES_URL_NON_POOLING="postgres://username:password@localhost:5432/tastemongers"
   ```

4. Set up the local database:
   ```bash
   npm run db:reset
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the website at [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

### GitHub Integration

The recommended approach for deploying to Vercel is through GitHub integration:

1. Push your code to a GitHub repository:
   ```bash
   git remote add origin https://github.com/yourusername/tastemongers.git
   git push -u origin main
   ```

2. Connect your repository to Vercel:
   - Log in to your Vercel account
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: tastemongers (if in a subdirectory)
     - Build Command: npm run build
     - Install Command: npm install

3. Configure environment variables:
   - Skip for now as they'll be added when setting up Vercel Postgres

4. Deploy the project:
   - Click "Deploy"
   - Vercel will build and deploy your application

### Manual Deployment

If you prefer not to use GitHub integration:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Follow the interactive prompts to configure your project.

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Database Setup

### Vercel Postgres Setup

1. Add a Postgres database to your Vercel project:
   - Go to your project on the Vercel dashboard
   - Navigate to "Storage" tab
   - Click "Connect Store" → "Create New" → "Postgres"
   - Follow the setup wizard to create a new database

2. Vercel will automatically add the required environment variables to your project:
   - `POSTGRES_URL`: Connection string for pooled connections
   - `POSTGRES_URL_NON_POOLING`: Connection string for non-pooled connections
   - `POSTGRES_USER`: Database username
   - `POSTGRES_PASSWORD`: Database password
   - `POSTGRES_HOST`: Database host
   - `POSTGRES_DATABASE`: Database name

### Running Migrations

After your database is set up and your application is deployed, you need to run the migration script:

1. Pull environment variables to a local file:
   ```bash
   vercel env pull .env.production.local
   ```

2. Run the migration script with the production environment:
   ```bash
   NODE_ENV=production npx tsx migrations/001_consolidated_setup.mts --drop
   ```

## Environment Variables

Vercel Postgres automatically sets up these environment variables:

- `POSTGRES_URL`: Primary connection string
- `POSTGRES_URL_NON_POOLING`: Connection string for non-pooled connections
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_HOST`: Database host
- `POSTGRES_DATABASE`: Database name

Additional environment variables you may need:

- `NEXT_PUBLIC_SITE_URL`: Public URL of your website
- `NEXT_PUBLIC_VERCEL_URL`: Automatically set by Vercel

## Deployment Troubleshooting

### Database Connection Issues

- Check your environment variables in the Vercel dashboard
- Ensure IP allow list includes Vercel's IPs if using IP restrictions
- Check if your database is in the same region as your deployment

### Migration Errors

- Check the console output for specific error messages
- Run migrations with `--verbose` flag for more detailed logs
- Make sure you're using the correct environment variables

### Image Loading Issues

- Verify that public images are correctly deployed
- Check image paths in the database
- Consider using Vercel's Image Optimization feature 