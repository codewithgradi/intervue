import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts", // Path to your schema file
  out: "./drizzle", // Folder where migration files will be saved
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.EXPO_PUBLIC_NEON_DB_URL!,
  },
} satisfies Config;
