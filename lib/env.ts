// Environment variable validation and loading
import { z } from "zod"

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),

  // Vercel Blob Storage
  BLOB_READ_WRITE_TOKEN: z.string().min(1),

  // Next.js
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default("http://localhost:3000"),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

// Function to validate environment variables
function validateEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors)
    throw new Error("Invalid environment variables")
  }
}

// Validate environment variables when this module is imported
validateEnv()

// Export typed environment variables
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN!,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
}

