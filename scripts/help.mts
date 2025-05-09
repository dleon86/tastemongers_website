#!/usr/bin/env node
/**
 * TasteMongers Help Script
 * 
 * This script provides information about available commands and their usage.
 * 
 * Usage:
 *   npm run help
 *   or
 *   npx tsx scripts/help.mts
 */

console.log('\n======================================================');
console.log('                TasteMongers Help');
console.log('======================================================\n');

console.log('Available commands:\n');

const commands = [
  {
    name: 'npm run dev',
    description: 'Start the development server'
  },
  {
    name: 'npm run build',
    description: 'Build the application for production'
  },
  {
    name: 'npm start',
    description: 'Start the production server'
  },
  {
    name: 'npm run deploy',
    description: 'Deploy the application (run migrations, copy photos, build)'
  },
  {
    name: 'npm run deploy:reset',
    description: 'Deploy the application with a fresh database (will drop all tables)'
  },
  {
    name: 'npm run migrate',
    description: 'Run database migrations without dropping tables'
  },
  {
    name: 'npm run migrate:drop',
    description: 'Drop all tables and run database migrations'
  },
  {
    name: 'npm run copy:photos',
    description: 'Copy cheese photos to the public directory'
  },
  {
    name: 'npm run db:reset',
    description: 'Reset the database (with confirmation)'
  },
  {
    name: 'npm run lint',
    description: 'Run linting checks'
  }
];

// Calculate the maximum command name length for alignment
const maxNameLength = Math.max(...commands.map(cmd => cmd.name.length));

// Print each command with its description
commands.forEach(cmd => {
  const paddedName = cmd.name.padEnd(maxNameLength);
  console.log(`  ${paddedName}  -  ${cmd.description}`);
});

console.log('\n\nDocumentation:\n');
console.log('  README.md                - General project information');
console.log('  docs/deployment_guide.md - Detailed deployment instructions');
console.log('  docs/project_structure.md - Project structure recommendations');

console.log('\n======================================================\n');

console.log('Getting started:');
console.log('1. Ensure PostgreSQL is running');
console.log('2. Create a .env file with database connection details');
console.log('3. Run npm run deploy to set up the application');
console.log('4. Run npm run dev to start the development server');
console.log('\n======================================================\n'); 