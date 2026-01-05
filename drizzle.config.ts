import { defineConfig } from "drizzle-kit";


/*
* Drizzle Kit configuration file used for schema introspection and migrations.
* Uses a PostgreSQL connection URL (local dev) to generate SQL artifacts from `src/schemas.ts`.
*/
export default defineConfig({
  schema: "src/schema.ts",
  out: "src/<path_to_generated_files>",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:postgres@localhost:5432/gator?sslmode=disable",
  },
});
