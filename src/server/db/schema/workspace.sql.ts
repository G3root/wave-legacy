import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { membership } from "./membership.sql";
import { generatePublicId } from "@/lib/public-id";

export const workspace = sqliteTable("workspace", {
  id: integer("id").primaryKey(),
  publicId: text("public_id")
    .notNull()
    .unique()
    .$defaultFn(() => generatePublicId("workspace")),
  name: text("name").notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const workspaceRelations = relations(workspace, ({ many }) => ({
  membership: many(membership),
}));
