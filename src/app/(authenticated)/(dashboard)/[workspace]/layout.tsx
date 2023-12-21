import { getRequiredNextAuthSession } from "@/lib/next-auth/get-server-component-session";
import { ReactNode } from "react";

export default async function WorkspacePage({
  params,
  children,
}: {
  params: { workspace: string };
  children: ReactNode;
}) {
  const session = await getRequiredNextAuthSession();

  if (params.workspace !== session.user.wsPbId) {
    throw new Error("unauthorized");
  }

  return <>{children}</>;
}
