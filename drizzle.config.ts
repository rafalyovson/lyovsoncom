import { defineConfig } from "drizzle-kit";
import "./src/data/envConfig";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/data/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
