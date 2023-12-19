import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import type { AuthOptions } from "next-auth";

import { env } from "@/env.mjs";

import { db } from "@/server/db";
import { SQLiteDrizzleAdapter } from "./adapter";

export const NextAuthConfig = {
  adapter: SQLiteDrizzleAdapter(db),
  secret: env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      sendVerificationRequest: ({ url }) => {
        if (env.NODE_ENV === "development") {
          console.log(`Login link: ${url}`);
          return;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
} satisfies AuthOptions;

export const { handlers, auth, signIn, signOut } = NextAuth(NextAuthConfig);
