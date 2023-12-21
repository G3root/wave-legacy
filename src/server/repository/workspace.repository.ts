import { KyselyDB } from "@/server/db";
import type { Config } from "unique-names-generator";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from "unique-names-generator";
import { generatePublicId } from "@/lib/public-id";

const config: Config = {
  dictionaries: [adjectives, colors],
  separator: "-",
};

export const countWorkspaces = (db: KyselyDB, publicId: string) => {
  return db
    .selectFrom("workspace")
    .select((eb) => eb.fn.count("id").as("workspaceCount"))
    .where("publicId", "=", publicId)
    .executeTakeFirstOrThrow();
};

interface createWorkspaceOptions {
  workspaceName?: string | null | undefined;
  userPublicId: string;
}

export const createWorkspace = async (
  db: KyselyDB,
  { userPublicId, workspaceName: workspaceName_ }: createWorkspaceOptions
) => {
  const workspaceName = workspaceName_ ?? uniqueNamesGenerator(config);

  const workspace = await db
    .insertInto("workspace")
    .values({
      name: workspaceName,
      publicId: generatePublicId("workspace"),
      creatorId: userPublicId,
    })
    .returning(["id", "name", "publicId"])
    .executeTakeFirstOrThrow();

  const membership = await db
    .insertInto("membership")
    .values({
      publicId: generatePublicId("member"),
      workspaceId: workspace.publicId,
      status: "accepted",
      joinedAt: new Date().toISOString(),
      userId: userPublicId,
    })
    .returning(["id", "publicId"])
    .executeTakeFirstOrThrow();

  return { workspace, membership };
};

interface getFirstWorkspaceOptions {
  userPublicId: string;
}

export const getFirstWorkspace = async (
  db: KyselyDB,
  { userPublicId }: getFirstWorkspaceOptions
) => {
  return await db
    .selectFrom("workspace")
    .innerJoin("membership as p", "p.workspaceId", "workspace.id")
    .where("p.userId", "=", userPublicId)
    .selectAll("workspace")
    .limit(1)
    .executeTakeFirstOrThrow();
};
