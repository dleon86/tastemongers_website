# TasteMongers - Artisanal Cheese Ratings & Reviews

TasteMongers is a website dedicated to artisanal cheese ratings, reviews, and recommendations.

## Tech Stack

- **Frontend:** Next.js 14+, React 18+, Tailwind CSS
- **Backend:** Next.js App Router API Routes
- **Database:** Vercel Postgres
- **Deployment:** Vercel

## Prerequisites

- Node.js 18+ and npm
- Vercel account (for deployment)
- Git

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

3. Create a `.env` file in the project root with the following variables:
   ```
   POSTGRES_URL="postgres://username:password@localhost:5432/tastemongers"
   POSTGRES_URL_NON_POOLING="postgres://username:password@localhost:5432/tastemongers"
   ```

4. Set up the database and load initial data:
   ```bash
   npm run db:reset
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Operations

The project uses a consolidated migration approach for simpler setup:

- `npm run db:migrate` - Run migrations without dropping existing tables
- `npm run db:reset` - Drop existing tables and run migrations

## Deployment on Vercel

1. Push your code to a GitHub repository

2. Connect your repository to Vercel:
   - Create a new project on Vercel
   - Import your GitHub repository
   - Configure project settings

3. Add a Vercel Postgres database:
   - In your Vercel project, go to Storage
   - Create a new Postgres database
   - Vercel will automatically add the necessary environment variables

4. Configure environment variables:
   - Vercel automatically configures Postgres environment variables
   - Add any additional environment variables your app needs

5. Deploy your project:
   - Vercel will automatically build and deploy your application
   - Run the database setup after deployment:
     ```bash
     vercel env pull .env.production.local
     npx tsx migrations/001_consolidated_setup.mts --drop
     ```

## Project Structure

- `/app` - Next.js App Router files and components
- `/app/api` - API routes
- `/content` - Markdown content for blog posts
- `/data` - Static data files and images
- `/migrations` - Database migration scripts
- `/public` - Static assets
- `/scripts` - Utility scripts for deployment and data management

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

[MIT License](LICENSE)
