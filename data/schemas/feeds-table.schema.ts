/** 
 * Reference material:
 * Data types: https://orm.drizzle.team/docs/column-types/pg
 * $onUpdate: https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0305#onupdate-functionality-for-postgresql-mysql-and-sqlite
 * Foreign key + cascade: https://orm.drizzle.team/docs/relations#foreign-key-actions
 * Generate migration: npx drizzle-kit generate
 * Apply migration: npx drizzle-kit migrate
 */
import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { users } from "./users-table.schema";


/*
 * Feeds table: stores RSS feed metadata added by users.
 */
export const feeds = pgTable("feeds", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  lastFetchedAt: timestamp("last_fetched_at"),
});
