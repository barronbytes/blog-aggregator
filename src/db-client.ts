/**
 * Reference material:
 * Drizzle PostgreSQL connection: https://orm.drizzle.team/docs/get-started-postgresql
 */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { readConfig } from "./file-handling.js";
import * as UsersTable from "../data/schemas/users-table.schema.js";
import * as FeedsTable from "../data/schemas/feeds-table.schema.js";


// Create a Drizzle ORM client using the PostgreSQL URL and designated table.
// `db` will run queries using the table defined in the schema.
const config = readConfig();
const conn = postgres(config.dbUrl);
export const db = drizzle(conn, { schema: { ...UsersTable, ...FeedsTable } });
