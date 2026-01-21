/**
 * Reference material:
 * Medium.com ($inferSelect): https://medium.com/codex/setting-up-drizzle-postgres-with-trpc-and-next-js-app-15fd8af68485
 * INSERT: https://orm.drizzle.team/docs/insert
 * SELECT: https://orm.drizzle.team/docs/select
 * UPDATE: https://orm.drizzle.team/docs/update
 * DELETE: https://orm.drizzle.team/docs/delete
 */
import { db } from "./db-client.js";
import { FeedsFollows } from "data/schemas/feeds-follows-table.schema.js";
import { and, eq } from "drizzle-orm";


// --------------------
// DECLARATIONS
// --------------------


export type FeedFollow = typeof FeedsFollows.$inferSelect;


// --------------------
// QUERIES
// --------------------


/* CREATE: Inserts a new join table entry into the feeds_follows table. */
export async function createFeedFollow(feedId: string, userId: string): Promise<FeedFollow> {
  const [result] = await db.insert(FeedsFollows)
    .values({ feedId, userId })
    .returning();
  return result;
}


/* READ: Returns entry for feed.id and user.id from feeds_follows table. */
export async function getFeedFollow(feedId: string, userId: string): Promise<FeedFollow | undefined> {
    const result = await db
        .select()
        .from(FeedsFollows)
        .where(and(
            eq(FeedsFollows.feedId, feedId),
            eq(FeedsFollows.userId, userId),
        ))
        .limit(1);
    return result[0];
}
