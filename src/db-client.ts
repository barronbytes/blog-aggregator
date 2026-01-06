import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as UsersTable from "../data/schemas/users-table.schema.js";
import { readConfig } from "./file-handling.js";


// Create a Drizzle ORM client using the PostgreSQL URL and designated table.
// `db` will run queries using the table defined in the schema.
const config = readConfig();
const conn = postgres(config.dbUrl);
export const db = drizzle(conn, { schema: UsersTable });
