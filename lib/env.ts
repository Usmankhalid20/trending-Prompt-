import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required').default('ai-prompt-hub-development-jwt-secret-key-2026'),
  REDIS_URL: z.string().optional(),
  REDIS_URI: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_URL: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional().default('admin@aiprompthub.com'),
  ADMIN_PASSWORD: z.string().optional().default('AdminPass123!'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ [ENV Validation Error] Invalid environment configuration:', result.error.format());
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Critical: Invalid or missing environment variables in production environment.');
    }
  }
  return (result.data || process.env) as Env;
}

export const env = validateEnv();
