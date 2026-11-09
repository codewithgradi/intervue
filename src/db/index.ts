import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.EXPO_PUBLIC_NEON_DB_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create the Neon connection
const sql = neon(process.env.EXPO_PUBLIC_NEON_DB_URL);

// Initialize Drizzle ORM with your schema definitions
export const db = drizzle(sql, { schema });
