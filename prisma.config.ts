import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Force dotenv to override any lingering terminal environment variables
config({ override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || env("DATABASE_URL"),
  },
});