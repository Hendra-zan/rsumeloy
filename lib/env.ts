// Required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
] as const;

// Optional environment variables with default values
const optionalEnvVars = {
  NODE_ENV: 'development',
  NEXT_PUBLIC_API_URL: 'http://localhost:3000',
} as const;

type RequiredEnvVar = typeof requiredEnvVars[number];
type OptionalEnvVar = keyof typeof optionalEnvVars;
type EnvVar = RequiredEnvVar | OptionalEnvVar;

function validateEnv(): void {
  const missingVars: RequiredEnvVar[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  // Report missing variables
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }

  // Set defaults for optional variables
  for (const [key, defaultValue] of Object.entries(optionalEnvVars)) {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
    }
  }
}

// Get environment variable with type safety
function getEnvVar(key: EnvVar): string {
  const value = process.env[key];
  
  if (!value) {
    if (key in optionalEnvVars) {
      return optionalEnvVars[key as OptionalEnvVar];
    }
    throw new Error(`Environment variable ${key} is not set`);
  }
  
  return value;
}

export { validateEnv, getEnvVar };