import { Insertable, Kysely, Selectable } from "kysely";

import type { Adapter } from "next-auth/adapters";
import { DB, User, Account, Session } from "@/server/db/types";
import { generatePublicId } from "../public-id";

type CustomAdapterUser = Selectable<User>;
type CustomAdapterAccount = Selectable<Account>;
type CustomAdapterSession = Selectable<Session>;
type UserUpdate = Insertable<User>;
type SessionUpdate = Insertable<Session>;
declare module "next-auth/adapters" {
  interface AdapterUser extends CustomAdapterUser {}

  interface AdapterAccount extends CustomAdapterAccount {}

  interface AdapterSession extends Omit<CustomAdapterSession, "id"> {}
}

// https://github.com/honeinc/is-iso-date/blob/master/index.js
const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value));
}

export const format = {
  from<T>(object?: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    for (const key in object) {
      const value = object[key];
      if (isDate(value)) newObject[key] = new Date(value);
      else newObject[key] = value;
    }
    return newObject as T;
  },
  to<T>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(object))
      newObject[key] = value instanceof Date ? value.toISOString() : value;
    return newObject as T;
  },
};

export function KyselyAdapter(db: Kysely<DB>): Adapter {
  const { adapter } = db.getExecutor();
  const { supportsReturning } = adapter;

  const to = format.to;

  const from = format.from;
  return {
    async createUser(data) {
      const user = {
        ...data,
        id: crypto.randomUUID(),
        publicId: generatePublicId("user"),
        updatedAt: new Date().toISOString(),
      };

      await db.insertInto("user").values(to(user)).executeTakeFirstOrThrow();
      return user;
    },
    async getUser(id) {
      const result = await db
        .selectFrom("user")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },
    async getUserByEmail(email) {
      const result = await db
        .selectFrom("user")
        .selectAll()
        .where("email", "=", email)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await db
        .selectFrom("user")
        .innerJoin("account", "user.id", "account.userId")
        .selectAll("user")
        .where("account.providerAccountId", "=", providerAccountId)
        .where("account.provider", "=", provider)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },
    async updateUser({ id, ...user }) {
      const userData: UserUpdate = to({
        ...user,
        updatedAt: new Date(),
      });
      const query = db.updateTable("user").set(userData).where("id", "=", id);
      const result = supportsReturning
        ? query.returningAll().executeTakeFirstOrThrow()
        : query
            .executeTakeFirstOrThrow()
            .then(() =>
              db
                .selectFrom("user")
                .selectAll()
                .where("id", "=", id)
                .executeTakeFirstOrThrow()
            );
      return from(await result);
    },
    async deleteUser(userId) {
      await db
        .deleteFrom("user")
        .where("user.id", "=", userId)
        .executeTakeFirst();
    },
    async linkAccount(account) {
      await db
        .insertInto("account")
        .values(to(account))
        .executeTakeFirstOrThrow();
      return account;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .deleteFrom("account")
        .where("account.providerAccountId", "=", providerAccountId)
        .where("account.provider", "=", provider)
        .executeTakeFirstOrThrow();
    },
    async createSession(session) {
      await db.insertInto("session").values(to(session)).execute();
      return session;
    },
    async getSessionAndUser(sessionToken) {
      const result = await db
        .selectFrom("session")
        .innerJoin("user", "user.id", "session.userId")
        .selectAll("user")
        .select(["session.expires", "session.userId"])
        .where("session.sessionToken", "=", sessionToken)
        .executeTakeFirst();
      if (!result) return null;
      const { userId, expires, ...user } = result;
      const session = { sessionToken, userId, expires };
      return { user: from(user), session: from(session) };
    },
    async updateSession(session) {
      const sessionData: SessionUpdate = to(session);
      const query = db
        .updateTable("session")
        .set(sessionData)
        .where("session.sessionToken", "=", session.sessionToken);
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await query.executeTakeFirstOrThrow().then(async () => {
            return await db
              .selectFrom("session")
              .selectAll()
              .where("session.sessionToken", "=", sessionData.sessionToken)
              .executeTakeFirstOrThrow();
          });
      return from(result);
    },
    async deleteSession(sessionToken) {
      await db
        .deleteFrom("session")
        .where("session.sessionToken", "=", sessionToken)
        .executeTakeFirstOrThrow();
    },
    async createVerificationToken(data) {
      await db.insertInto("verificationToken").values(to(data)).execute();
      return data;
    },
    async useVerificationToken({ identifier, token }) {
      const query = db
        .deleteFrom("verificationToken")
        .where("verificationToken.token", "=", token)
        .where("verificationToken.identifier", "=", identifier);

      const result = supportsReturning
        ? await query.returningAll().executeTakeFirst()
        : await db
            .selectFrom("verificationToken")
            .selectAll()
            .where("token", "=", token)
            .executeTakeFirst()
            .then(async (res) => {
              await query.executeTakeFirst();
              return res;
            });
      if (!result) return null;
      return from(result);
    },
  };
}

/**
 * Wrapper over the original `Kysely` class in order to validate the passed in
 * database interface. A regular Kysely instance may also be used, but wrapping
 * it ensures the database interface implements the fields that Auth.js
 * requires. When used with `kysely-codegen`, the `Codegen` type can be passed as
 * the second generic argument. The generated types will be used, and
 * `KyselyAuth` will only verify that the correct fields exist.
 */
export class KyselyAuth<DB extends T, T = DB> extends Kysely<DB> {}

export type Codegen = {
  [K in keyof DB]: { [J in keyof DB[K]]: unknown };
};
