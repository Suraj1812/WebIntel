import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  SESSION_SECRET: z.string().min(24, "SESSION_SECRET must be at least 24 characters."),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_REPORT_MODEL: z.string().default("gpt-5.4-mini"),
  SCRAPER_SERVICE_URL: z.string().url().default("http://127.0.0.1:8001"),
  APP_URL: z.string().url().default("http://127.0.0.1:3000"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(30),
  FREE_PLAN_MONTHLY_SCANS: z.coerce.number().int().positive().default(3),
  STORAGE_ROOT: z.string().default("./storage"),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  cachedEnv = envSchema.parse(process.env);
  return cachedEnv;
}

export function getOptionalOpenAiKey() {
  return process.env.OPENAI_API_KEY?.trim() || "";
}
