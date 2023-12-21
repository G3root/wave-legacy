import { PageHeader } from "@/components/projects/page-header";
import { StatusTab } from "@/components/projects/status-tab";
import { getRequiredNextAuthSession } from "@/lib/next-auth/get-server-component-session";
import * as React from "react";

export type ProjectsLayoutProps = {
  children: React.ReactNode;
};

export default async function ProjectsLayout({
  children,
}: ProjectsLayoutProps) {
  const session = await getRequiredNextAuthSession();
  return (
    <>
      <PageHeader />
      <StatusTab workspaceId={session.user.wsPbId}>{children}</StatusTab>
    </>
  );
}
