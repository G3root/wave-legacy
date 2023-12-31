import { NextAuthConfig } from "@/lib/next-auth/auth-options";
import NextAuth from "next-auth";

const handler = NextAuth(NextAuthConfig);
export { handler as GET, handler as POST };
