"use server";
import invariant from "tiny-invariant";

import { cache } from "react";

import { NextAuthConfig } from "./auth-options";
import { db } from "@/server/db";

import { getServerSession } from "next-auth";

export const getNextAuthSession = () => {
  return getServerSession(NextAuthConfig);
};

export const getRequiredNextAuthSession = async () => {
  const session = await getNextAuthSession();
  invariant(session, "Session not found");
  return session;
};

export const getServerComponentSession = cache(async () => {
  const session = await getNextAuthSession();

  if (!session || !session.user?.email) {
    return { user: null, session: null };
  }

  const user = await db
    .selectFrom("user")
    .selectAll()
    .where("email", "=", session.user?.email)
    .executeTakeFirst();
  if (!user) {
    throw new Error("No user found");
  }
  return { user, session };
});

export const getRequiredServerComponentSession = cache(async () => {
  const { user, session } = await getServerComponentSession();

  if (!user || !session) {
    throw new Error("No session found");
  }

  return { user, session };
});
