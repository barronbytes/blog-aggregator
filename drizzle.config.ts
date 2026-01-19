/**
 * Reference material:
 * Medium article (config file): https://javascript.plainenglish.io/drizzle-orm-nestjs-database-migration-set-up-e9f1dfd71ed6
 */
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";


// --------------------
// DECLARATIONS
// --------------------


dotenv.config();
const DB_URL = process.env.DB_URL || "";

if (!DB_URL) {
  throw new Error("Error: DB_URL is required but not set as an environment variable.");
}


/*
 * Drizzle Kit configuration file for local PostgreSQL connection.
 * Reads ORM mappings from the `schema` location and generates
 * helper and migration files to the `out` location.
 */
export default defineConfig({
  schema: ["data/schemas/*.ts"],  // Path to schema files, wildcard to catch all files
  out: "data/generated",          // Path to migration output files
  dialect: "postgresql",          // Database type
  dbCredentials: {                // Database connection url
    url: DB_URL,
  },
});
