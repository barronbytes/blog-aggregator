import { db } from "./db-client.js";
import { users } from "../data/schemas/users-table.schema.js";
import { eq } from "drizzle-orm";


/**
 * Inserts a new user into the users table.
 */
export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name }).returning();
  return result;
}


/**
 * Selects user by username from the users table.
 */
export async function getUserByName(username: string) {
  const [result] = await db.select().from(users).where(eq(users.name, username));
  return result;
}


/**
 * Deletes all rows in the users table.
 */
export async function resetTable() {
  await db.delete(users);
}
