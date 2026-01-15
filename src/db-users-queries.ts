import { db } from "./db-client.js";
import { users } from "../data/schemas/users-table.schema.js";
import { eq } from "drizzle-orm";


// --------------------
// DECLARATIONS
// --------------------


export type User = typeof users.$inferSelect;


// --------------------
// QUERIES
// --------------------


/* CREATE: Inserts a new user into the users table. */
export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name }).returning();
  return result;
}


/* READ: Selects all users in the users table. */
export async function getUsers() {
  const results = await db.select().from(users);
  return results;
}


/* READ: Selects user by username from the users table. */
export async function getUserByName(username: string) {
  const [result] = await db.select().from(users).where(eq(users.name, username));
  return result;
}


/* DELETE: Deletes all rows in the users table. */
export async function resetTable() {
  await db.delete(users);
}
