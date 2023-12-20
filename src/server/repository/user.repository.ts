import { KyselyDB } from "@/server/db";

export const getUserById = (db: KyselyDB, id: string) => {
  return db
    .selectFrom("user")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
};
