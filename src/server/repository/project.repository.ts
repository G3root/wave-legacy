import { generatePublicId } from "@/lib/public-id";
import { KyselyDB } from "@/server/db";
import type { Insertable } from "kysely";
import { Project } from "../db/types";

type InsertTypes = Insertable<Project>;

export const createProject = (
  db: KyselyDB,
  data: Omit<InsertTypes, "publicId">
) => {
  return db
    .insertInto("project")
    .values({
      ...data,
      publicId: generatePublicId("project"),
    })
    .executeTakeFirstOrThrow();
};
