/**
 * Reference material:
 * Medium.com ($inferSelect): https://medium.com/codex/setting-up-drizzle-postgres-with-trpc-and-next-js-app-15fd8af68485
 * INSERT: https://orm.drizzle.team/docs/insert
 * SELECT: https://orm.drizzle.team/docs/select
 * UPDATE: https://orm.drizzle.team/docs/update
 * DELETE: https://orm.drizzle.team/docs/delete
 * Filters: https://orm.drizzle.team/docs/operators
 */
import { eq } from "drizzle-orm";
import { db } from "./db-client.js";
import { users } from "../../data/schemas/users-table.schema.js";


// --------------------
// DECLARATIONS
// --------------------


export type User = typeof users.$inferSelect;


// --------------------
// QUERIES
// --------------------


/* CREATE: Inserts a new user into the users table. */
export async function createUser(name: string): Promise<User> {
  const [result] = await db
    .insert(users)
    .values({ name })
    .returning();
  return result;
}


/* READ: Selects all users from the users table. */
export async function getUsers(): Promise<User[]> {
  const results = await db
    .select()
    .from(users);
  return results;
}


/* READ: Selects user by username from the users table. */
export async function getUserByName(username: string): Promise<User | undefined> {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.name, username));
  return result;
}


/* READ: Selects user by ID from the users table. */
export async function getUserByID(userID: string): Promise<User | undefined> {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.id, userID));
  return result;
}


/* DELETE: Deletes all rows in the users table. */
export async function resetTable(): Promise<void> {
  await db
    .delete(users);
}
