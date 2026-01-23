/**
 * Reference material:
 * Medium.com ($inferSelect): https://medium.com/codex/setting-up-drizzle-postgres-with-trpc-and-next-js-app-15fd8af68485
 * INSERT: https://orm.drizzle.team/docs/insert
 * SELECT: https://orm.drizzle.team/docs/select
 * UPDATE: https://orm.drizzle.team/docs/update
 * DELETE: https://orm.drizzle.team/docs/delete
 */
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db } from "./db-client.js";
import { feeds } from "../../data/schemas/feeds-table.schema.js"; 


// --------------------
// DECLARATIONS
// --------------------


export type Feed = typeof feeds.$inferSelect;


// --------------------
// QUERIES
// --------------------


/* CREATE: Inserts a new feed into the feeds table. */
export async function createFeed(name: string, url: string, userId: string): Promise<Feed> {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
    .returning();
  return result;
}


/* READ: Selects all feeds from the feeds table. */
export async function getFeeds(): Promise<Feed[]> {
  const results = await db
    .select()
    .from(feeds);
  return results;
}


/* READ: Selects feed by name from the feeds table. */
export async function getFeedByUrl(feedUrl: string): Promise<Feed | undefined> {
  const [result] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, feedUrl));
  return result;
}


/* READ: Returns feed name for feed. */
export async function getFeedNameById(feedId: string): Promise<string | undefined> {
  const [result] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.id, feedId));
  return result.name;
}


/* READ: Returns the next feed to fetch. 
 * Prioritizes last_fetched_at values of NULL first, then oldest NON-NULL timestamp next.
 */
export async function getNextFeedToFetch(): Promise<Feed | undefined> {
  const [feed] = await db
    .select()
    .from(feeds)
    .orderBy(sql`last_fetched_at ASC NULLS FIRST`) // NULLs first, then by oldest timestamps
    .limit(1);
  return feed;
}


/* UPDATE: Marks a feed as fetched by setting timestamps. */
export async function updateFetchedTime(feedId: string): Promise<void> {
  await db
    .update(feeds)
    .set({
      updatedAt: new Date(),
      lastFetchedAt: new Date(),
    })
    .where(eq(feeds.id, feedId));
}
