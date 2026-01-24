/**
 * Reference material:
 * Medium.com ($inferSelect): https://medium.com/codex/setting-up-drizzle-postgres-with-trpc-and-next-js-app-15fd8af68485
 * INSERT: https://orm.drizzle.team/docs/insert
 * SELECT: https://orm.drizzle.team/docs/select
 * UPDATE: https://orm.drizzle.team/docs/update
 * DELETE: https://orm.drizzle.team/docs/delete
 */
import { eq } from "drizzle-orm";
import { db } from "./db-client.js";
import { posts } from "../../data/schemas/posts-table.schema.js"; 


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
