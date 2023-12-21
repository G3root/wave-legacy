import React from "react";

import { redirect } from "next/navigation";

import { getNextAuthSession } from "@/lib/next-auth/get-server-component-session";

export type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const session = await getNextAuthSession();

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
}
