import { db } from "./db-client.js";
import { feeds } from "../data/schemas/feeds-table.schema.js"; 


/**
 * CREATE: Inserts a new feed into the feeds table.
 */
export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds)
    .values({ name, url, userId })
    .returning();
  return result;
}
