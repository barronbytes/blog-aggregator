/** 
 * Reference material:
 * Data types: https://orm.drizzle.team/docs/column-types/pg
 * $onUpdate: https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0305#onupdate-functionality-for-postgresql-mysql-and-sqlite
 * Foreign key + cascade: https://orm.drizzle.team/docs/relations#foreign-key-actions
 * Generate migration: npx drizzle-kit generate
 * Apply migration: npx drizzle-kit migrate
 */
import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { feeds } from "./feeds-table.schema";


/*
 * Posts table: stores post information for feeds.
 */
export const posts = pgTable("posts", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  description: text("description").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  feedId: uuid("feed_id")
    .notNull()
    .references(() => feeds.id, { onDelete: "cascade", onUpdate: "cascade" }),
});
