/**
 * Reference material:
 * Medium.com ($inferSelect): https://medium.com/codex/setting-up-drizzle-postgres-with-trpc-and-next-js-app-15fd8af68485
 * INSERT: https://orm.drizzle.team/docs/insert
 * SELECT: https://orm.drizzle.team/docs/select
 * UPDATE: https://orm.drizzle.team/docs/update
 * DELETE: https://orm.drizzle.team/docs/delete
 */
import { eq, desc, count } from "drizzle-orm";
import { db } from "./db-client.js";
import { posts } from "../../data/schemas/posts-table.schema.js"; 
import { FeedsFollows } from "../../data/schemas/feeds-follows-table.schema.js";


// --------------------
// DECLARATIONS
// --------------------


export type Post = typeof posts.$inferSelect;


// --------------------
// QUERIES
// --------------------


/* CREATE: Inserts a new post into the posts table. */
export async function createPost(
  title: string, url: string, description: string, publishedAt: Date, feedId: string
): Promise<Post> {
  const [result] = await db
    .insert(posts)
    .values({ title, url, description, publishedAt, feedId })
    .returning();
  return result;
}


/* READ: Returns the most recent posts from feeds followed by the given user.
 * The number of posts returned is limited by the 'rows' parameter.
 * Drizzle's eq() method can compare (column, column) or (column, value)!!!
 * SQL joins produce flat tables, but Drizzlels ORM nests table rows, so possible to map row.posts!!!
 */
export async function getPostsForUser(userId: string, rows: number): Promise<Post[] | undefined> {
  const results = await db
    .select()
    .from(posts)
    .innerJoin(
      FeedsFollows,
      eq(posts.feedId, FeedsFollows.feedId) // column = column
    )
    .where(eq(FeedsFollows.userId, userId)) // column = value
    .orderBy(desc(posts.publishedAt))       // most recent first
    .limit(rows);
  return results.map(row => row.posts);
}


/* READ: Returns total number of posts from feeds followed by the given user. */
export async function getPostCountForUser(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(posts)
    .innerJoin(
      FeedsFollows,
      eq(posts.feedId, FeedsFollows.feedId)
    )
    .where(eq(FeedsFollows.userId, userId));
  return result.count;
}
