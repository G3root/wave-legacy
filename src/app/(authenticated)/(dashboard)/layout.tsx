import { SideBar } from "@/components/dashboard/sidebar/sidebar";
import * as React from "react";

export type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="bg-background">
      <div className="grid lg:grid-cols-5">
        <SideBar />
        {children}
      </div>
    </div>
  );
}
