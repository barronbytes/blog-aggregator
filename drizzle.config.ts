import { defineConfig } from "drizzle-kit";


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
    url: "postgresql://postgres:postgres@localhost:5432/gator?sslmode=disable",
  },
});
