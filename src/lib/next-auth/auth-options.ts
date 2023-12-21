import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import type { AuthOptions } from "next-auth";

import { env } from "@/env.mjs";

import { db } from "@/server/db";
import { KyselyAdapter } from "./adapter";

import {
  createWorkspace,
  getFirstWorkspace,
} from "@/server/repository/workspace.repository";
import { getUserByPublicId } from "@/server/repository/user.repository";
import { User as User_ } from "@/server/db/types";
declare module "next-auth" {
  interface User extends User_ {}
  interface Session {
    user: {
      wsPbId: string;
      usrPbId: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    wsPbId: string;
    usrPbId: string;
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
      session.user.wsPbId = token?.wsPbId;
      session.user.usrPbId = token?.usrPbId;
      return session;
    },
    async jwt({ token, trigger, user }) {
      if (trigger === "signUp" && user.id) {
        const userPublicId = user.publicId;

        const { publicId: usrPbId } = await getUserByPublicId(db, userPublicId);

        const {
          workspace: { publicId: wsPbId },
        } = await createWorkspace(db, {
          userPublicId,
          workspaceName: user.name,
        });

        token.wsPbId = wsPbId;
        token.usrPbId = usrPbId;
      }

      if (user && trigger === "signIn") {
        const userPublicId = user.publicId;
        const { publicId: wsPbId } = await getFirstWorkspace(db, {
          userPublicId,
        });
        token.wsPbId = wsPbId;
        token.usrPbId = userPublicId;
      }

      return token;
    },
  },
} satisfies AuthOptions;

export const { handlers, auth, signIn, signOut } = NextAuth(NextAuthConfig);
