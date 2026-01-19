/** 
 * Reference material:
 * Data types: https://orm.drizzle.team/docs/column-types/pg
 * $onUpdate: https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0305#onupdate-functionality-for-postgresql-mysql-and-sqlite
 */
import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";


/*
* Users table: stores username and lifecycle timestamps
*/
export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});
