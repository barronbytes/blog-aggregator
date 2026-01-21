/** 
 * Reference material:
 * Data types: https://orm.drizzle.team/docs/column-types/pg
 * $onUpdate: https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0305#onupdate-functionality-for-postgresql-mysql-and-sqlite
 * Foreign key + cascade: https://orm.drizzle.team/docs/relations#foreign-key-actions
 * Generate migration: npx drizzle-kit generate
 * Apply migration: npx drizzle-kit migrate
 */
import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users-table.schema";
import { feeds } from "./feeds-table.schema";


/*
* Join table: many-to-many relationship
*/
export const FeedsFollows = pgTable(
  "feeds_follows",
  {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => [
    primaryKey({
      name: "feed_user",
      columns: [table.feedId, table.userId],
    }),
  ]
);
