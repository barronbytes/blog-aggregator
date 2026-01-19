/**
 * Reference material:
 * Medium.com ($inferSelect): https://medium.com/codex/setting-up-drizzle-postgres-with-trpc-and-next-js-app-15fd8af68485
 * INSERT: https://orm.drizzle.team/docs/insert
 * SELECT: https://orm.drizzle.team/docs/select
 */
import { db } from "./db-client.js";
import { feeds } from "../data/schemas/feeds-table.schema.js"; 


// --------------------
// DECLARATIONS
// --------------------


export type Feed = typeof feeds.$inferSelect;


// --------------------
// QUERIES
// --------------------


/* CREATE: Inserts a new feed into the feeds table. */
export async function createFeed(name: string, url: string, userId: string): Promise<Feed> {
  const [result] = await db.insert(feeds)
    .values({ name, url, userId })
    .returning();
  return result;
}


/* READ: Selects all feeds from the feeds table. */
export async function getFeeds(): Promise<Feed[]> {
  const results = await db.select().from(feeds);
  return results;
}
