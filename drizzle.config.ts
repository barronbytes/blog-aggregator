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
  schema: "data/schemas/schema.ts",
  out: "data/generated",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
});
