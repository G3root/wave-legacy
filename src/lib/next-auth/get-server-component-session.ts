"use server";

import { cache } from "react";

import { getServerSession as getNextAuthServerSession } from "next-auth";

import { NextAuthConfig } from "./auth-options";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { user as userSchema } from "@/server/db/schema";

export const getServerComponentSession = cache(async () => {
  const session = await getNextAuthServerSession(NextAuthConfig);

  if (!session || !session.user?.email) {
    return { user: null, session: null };
  }

  const user = await db.query.user.findFirst({
    where: eq(userSchema.email, session.user.email),
  });

  return { user, session };
});

export const getRequiredServerComponentSession = cache(async () => {
  const { user, session } = await getServerComponentSession();

  if (!user || !session) {
    throw new Error("No session found");
  }

  return { user, session };
});
