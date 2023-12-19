import React from "react";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { NextAuthConfig } from "@/lib/next-auth/auth-options";
import { NextAuthProvider } from "@/providers/next-auth";

export type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const session = await getServerSession(NextAuthConfig);

  if (!session) {
    redirect("/signin");
  }

  return <NextAuthProvider session={session}>{children}</NextAuthProvider>;
}
