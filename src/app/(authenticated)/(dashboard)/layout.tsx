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
        <div className="col-span-3 lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
