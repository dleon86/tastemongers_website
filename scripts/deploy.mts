#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// --- Determine the directory path in ES module scope ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Deployment Script
 * 
 * This script prepares the application for Vercel deployment by running necessary steps:
 * 1. Ensure environment variables are set
 * 2. Run database migrations
 * 3. Build the application for production or preview
 * 
 * Run with: npx tsx scripts/deploy.mts
 * Options:
 *   --drop: Drop existing tables before running migrations
 *   --preview: Build for preview environment
 */

function executeCommand(command: string, cwd = rootDir) {
  console.log(`\n> ${command}`);
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env }
    });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    return false;
  }
}

async function deploy() {
  console.log('===============================================');
  console.log('TasteMongers Vercel Deployment Script');
  console.log('===============================================\n');

  // Check for environment
  const isPreview = process.argv.includes('--preview');
  const shouldDrop = process.argv.includes('--drop');
  
  console.log(`Deployment mode: ${isPreview ? 'Preview' : 'Production'}`);
  console.log(`Database reset: ${shouldDrop ? 'Yes' : 'No'}`);

  // Step 1: Check for environment variables
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('No .env file found. Checking for Vercel environment variables...');
    
    // Check if we're running in a Vercel environment or if the required env vars exist
    if (!process.env.POSTGRES_URL) {
      console.error('Error: No database connection details found.');
      console.log('If running locally, create a .env file with POSTGRES_URL and other required variables.');
      console.log('If running on Vercel, make sure the Postgres database is properly configured.');
      process.exit(1);
    }
    console.log('✅ Vercel environment variables detected');
  } else {
    console.log('✅ .env file found');
  }

  // Step 2: Install dependencies if needed
  if (!fs.existsSync(path.join(rootDir, 'node_modules'))) {
    console.log('Installing dependencies...');
    if (!executeCommand('npm install')) {
      process.exit(1);
    }
  }
  console.log('✅ Dependencies checked');

  // Step 3: Run database migrations
  console.log('\nSetting up database...');
  
  // Create migration command
  const migrationCommand = shouldDrop 
    ? 'npx tsx migrations/001_consolidated_setup.mts --drop'
    : 'npx tsx migrations/001_consolidated_setup.mts';
  
  if (!executeCommand(migrationCommand)) {
    console.error('Database migration failed. Aborting deployment.');
    process.exit(1);
  }
  console.log('✅ Database set up successfully');

  // Step 4: Build the application for production or preview
  console.log('\nBuilding application...');
  const buildCommand = isPreview ? 'npm run build' : 'npm run build';
  
  if (!executeCommand(buildCommand)) {
    console.error('Build failed. Aborting deployment.');
    process.exit(1);
  }
  console.log('✅ Application built successfully');

  console.log('\n===============================================');
  console.log('🎉 Deployment preparation completed successfully!');
  console.log('Your app is ready to be deployed on Vercel.');
  console.log('===============================================');
}

// Run the deployment script
deploy().catch(error => {
  console.error('Deployment failed:', error);
  process.exit(1);
}); 