import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import type { AuthOptions } from "next-auth";

import { env } from "@/env.mjs";

import { db } from "@/server/db";
import { KyselyAdapter } from "./adapter";

import {
  createWorkspace,
  getFirstWorkspace,
} from "@/repository/workspace.repository";
import { getUserById } from "@/repository/user.repository";
import { User as User_ } from "@/server/db/types";
declare module "next-auth" {
  interface User extends User_ {}
  interface Session {
    user: {
      wsId: string;
      publicId: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    wsId: string;
    publicId: string;
  }
}

export const NextAuthConfig = {
  adapter: KyselyAdapter(db),
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

  callbacks: {
    session({ session, token }) {
      session.user.wsId = token?.wsId;
      session.user.publicId = token?.publicId;
      return session;
    },
    async jwt({ token, trigger, user }) {
      if (trigger === "signUp" && user.id) {
        const userId = user.id;
        const { publicId } = await getUserById(db, userId);
        const { workspace } = await createWorkspace(db, {
          userId,
          workspaceName: user.name,
        });
        token.wsId = workspace.publicId;
        token.publicId = publicId;
      }

      if (user && trigger === "signIn") {
        const workspace = await getFirstWorkspace(db, user.id);
        token.wsId = workspace.publicId;
        token.publicId = user.publicId;
      }

      return token;
    },
  },
} satisfies AuthOptions;

export const { handlers, auth, signIn, signOut } = NextAuth(NextAuthConfig);
