/**
 * Reference material:
 * Medium.com ($inferSelect): https://medium.com/codex/setting-up-drizzle-postgres-with-trpc-and-next-js-app-15fd8af68485
 * INSERT: https://orm.drizzle.team/docs/insert
 * SELECT: https://orm.drizzle.team/docs/select
 * UPDATE: https://orm.drizzle.team/docs/update
 * DELETE: https://orm.drizzle.team/docs/delete
 */
import { and, eq } from "drizzle-orm";
import { db } from "./db-client.js";
import { FeedsFollows } from "data/schemas/feeds-follows-table.schema.js";


// --------------------
// DECLARATIONS
// --------------------


export type FeedFollow = typeof FeedsFollows.$inferSelect;


// --------------------
// QUERIES
// --------------------


/* CREATE: Inserts a new join table entry into the feeds_follows table. */
export async function createFeedFollow(feedId: string, userId: string): Promise<FeedFollow> {
  const [result] = await db
    .insert(FeedsFollows)
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


/* READ: Returns the feed ids the current user follows. */
export async function getFeedIdsFollowedByUserId(userId: string): Promise<string[]> {
  const result = await db
    .select()
    .from(FeedsFollows)
    .where(eq(FeedsFollows.userId, userId));
  return result.map(row => row.feedId);
}


/* DELETE: Deletes single row from  table. */
export async function deleteFeedFollow(feedId: string, userId: string): Promise<void> {
  await db
    .delete(FeedsFollows)
    .where(
      and(
        eq(FeedsFollows.feedId, feedId),
        eq(FeedsFollows.userId, userId),
      )
    );
}
