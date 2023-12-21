import { KyselyDB } from "@/server/db";

export const getUserByPublicId = (db: KyselyDB, id: string) => {
  return db
    .selectFrom("user")
    .selectAll()
    .where("publicId", "=", id)
    .executeTakeFirstOrThrow();
};
