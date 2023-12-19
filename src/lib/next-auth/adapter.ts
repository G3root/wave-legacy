import { eq, and } from "drizzle-orm";
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

import type { Adapter, AdapterAccount } from "@auth/core/adapters";
import { user as users } from "@/server/db/schema/user.sql";
import { session as sessions } from "@/server/db/schema/session.sql";
import { account as accounts } from "@/server/db/schema/account.sql";
import { verificationToken as verificationTokens } from "@/server/db/schema/verification-token.sql";
import { generatePublicId } from "../public-id";

export function SQLiteDrizzleAdapter(
  client: InstanceType<typeof BaseSQLiteDatabase>
): Adapter {
  return {
    async createUser(data) {
      return await client
        .insert(users)
        .values({
          ...data,
          id: crypto.randomUUID(),
          publicId: generatePublicId("user"),
        })
        .returning()
        .get();
    },
    async getUser(data) {
      const result = await client
        .select()
        .from(users)
        .where(eq(users.id, data))
        .get();
      return result ?? null;
    },
    async getUserByEmail(data) {
      const result = await client
        .select()
        .from(users)
        .where(eq(users.email, data))
        .get();
      return result ?? null;
    },
    createSession(data) {
      return client.insert(sessions).values(data).returning().get();
    },
    async getSessionAndUser(data) {
      const result = await client
        .select({ session: sessions, user: users })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .get();
      return result ?? null;
    },
    async updateUser(data) {
      if (!data.id) {
        throw new Error("No user id.");
      }

      const result = await client
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()
        .get();
      return result ?? null;
    },
    async updateSession(data) {
      const result = await client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .get();
      return result ?? null;
    },
    async linkAccount(rawAccount) {
      const updatedAccount = await client
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .get();

      const account = {
        ...updatedAccount,
        type: updatedAccount.type,
        access_token: updatedAccount.access_token ?? undefined,
        token_type: updatedAccount.token_type ?? undefined,
        id_token: updatedAccount.id_token ?? undefined,
        refresh_token: updatedAccount.refresh_token ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expires_at ?? undefined,
        session_state: updatedAccount.session_state ?? undefined,
      } as unknown as AdapterAccount;

      return account;
    },
    async getUserByAccount(account) {
      const result = await client
        .select()
        .from(accounts)
        .leftJoin(users, eq(users.id, accounts.userId))
        .where(
          and(
            eq(accounts.provider, account.provider),
            eq(accounts.providerAccountId, account.providerAccountId)
          )
        )
        .get();
      return result?.user ?? null;
    },
    async deleteSession(sessionToken) {
      const result = await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning()
        .get();
      return result ?? null;
    },
    async createVerificationToken(token) {
      const result = await client
        .insert(verificationTokens)
        .values(token)
        .returning()
        .get();
      return result ?? null;
    },
    async useVerificationToken(token) {
      try {
        const result = await client
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token)
            )
          )
          .returning()
          .get();
        return result ?? null;
      } catch (err) {
        throw new Error("No verification token found.");
      }
    },
    async deleteUser(id) {
      const result = await client
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .get();
      return result ?? null;
    },
    async unlinkAccount(account) {
      await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .run();

      return undefined;
    },
  };
}
