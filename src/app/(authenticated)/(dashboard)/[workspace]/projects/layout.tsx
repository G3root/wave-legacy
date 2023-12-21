import { PageHeader } from "@/components/projects/page-header";
import * as React from "react";

export type ProjectsLayoutProps = {
  children: React.ReactNode;
};

export default async function ProjectsLayout({
  children,
}: ProjectsLayoutProps) {
  return (
    <>
      <PageHeader />
      {children}
    </>
  );
}
