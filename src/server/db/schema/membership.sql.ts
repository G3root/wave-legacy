import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { workspace } from "./workspace.sql";
import { user } from "./user.sql";

const MEMBERSHIP_STATUS = ["accepted", "pending", "declined"] as const;

export const membership = sqliteTable(
  "membership",
  {
    id: integer("id").primaryKey(),
    publicId: text("public_id").notNull().unique(),
    status: text("status", { enum: MEMBERSHIP_STATUS }).default("pending"),

    workspaceId: integer("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => user.id, {
      onDelete: "cascade",
    }),

    // When the user joins, we will clear out the name and email and set the user.
    invitedName: text("invited_name"),
    invitedEmail: text("invited_email"),

    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
  },
  (t) => ({
    unq: unique().on(t.workspaceId, t.invitedEmail),
  })
);

export const membershipRelations = relations(membership, ({ one }) => ({
  workspace: one(workspace, {
    fields: [membership.workspaceId],
    references: [workspace.id],
  }),
  user: one(user, {
    fields: [membership.userId],
    references: [user.id],
  }),
}));
