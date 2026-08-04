import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // App
  APP_URL: z.string().url().default('http://localhost:3000'),
  
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),

  // Redis (Rate Limiting)
  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().optional(),

  // Storage (Supabase)
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_BUCKET_NAME: z.string().optional(),
});

// Validate `process.env` against the schema
// In Next.js, we only want to throw errors during server-side execution 
// or at build time, not during client-side execution.
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || undefined,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || undefined,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  KV_REST_API_URL: process.env.KV_REST_API_URL || undefined,
  KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN || undefined,
  SUPABASE_URL: process.env.SUPABASE_URL || undefined,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  SUPABASE_BUCKET_NAME: process.env.SUPABASE_BUCKET_NAME || undefined,
};

let env = processEnv as z.infer<typeof envSchema>;

if (typeof window === 'undefined') {
  const parsed = envSchema.safeParse(processEnv);

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables');
  }

  env = parsed.data;
}

export { env };
