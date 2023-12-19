import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { membership } from "./membership.sql";

export const GLOBAL_ROLE = ["super-admin", "customer"] as const;

export const user = sqliteTable("user", {
  id: integer("id").primaryKey(),
  publicId: text("public_id").notNull().unique(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  globalRole: text("global_role", { enum: GLOBAL_ROLE }).default("customer"),

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

export const userRelations = relations(user, ({ many }) => ({
  membership: many(membership),
}));
