import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

// Required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
];

// Optional environment variables with default values
const optionalEnvVars = {
  NODE_ENV: 'development',
  NEXT_PUBLIC_API_URL: 'http://localhost:3000',
};

function validateEnv() {
  const missingVars = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  // Report missing variables
  if (missingVars.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Environment validation failed:');
    console.error('Missing required environment variables:');
    missingVars.forEach(v => console.error(`  - ${v}`));
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  // Set defaults for optional variables
  for (const [key, defaultValue] of Object.entries(optionalEnvVars)) {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
    }
  }

  console.log('\x1b[32m%s\x1b[0m', '✅ Environment variables validation passed');
}

validateEnv();