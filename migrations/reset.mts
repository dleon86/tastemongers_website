#!/usr/bin/env node
/**
 * Database Reset Script
 * 
 * This script is a simple wrapper around the consolidated migration script
 * with the --drop flag to reset the database.
 * 
 * Usage:
 *   npm run migrate:drop
 *   or
 *   npx tsx migrations/reset.mts
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Determine the directory path in ES module scope ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===================================');
console.log('TasteMongers Database Reset Script');
console.log('===================================');
console.log('\nWARNING: This will DROP ALL TABLES and recreate them from scratch.');
console.log('All existing data will be lost and replaced with seed data.\n');

// Check if --confirm flag is present
const isConfirmed = process.argv.includes('--confirm');

if (!isConfirmed) {
  console.log('To confirm this action, run again with the --confirm flag:');
  console.log('npx tsx migrations/reset.mts --confirm');
  process.exit(0);
}

try {
  console.log('Resetting database...');
  execSync('npx tsx migrations/001_consolidated_setup.mts --drop', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  console.log('\n✅ Database reset completed successfully.');
  console.log('The database has been reset with initial seed data.');
} catch (error) {
  console.error('\n❌ Database reset failed:', error);
  process.exit(1);
}
