"use client";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { useSelectedLayoutSegments } from "next/navigation";
import { FolderKanban, Inbox, LayoutDashboard, LucideIcon } from "lucide-react";
import { IssueCreationSection } from "./issue-creation-section";

interface SideBarProps {
  className?: string;
}

type NavItem = {
  label: string;
  active?: boolean;
  Icon: LucideIcon;
};

export function SideBar({ className }: SideBarProps) {
  const segments = useSelectedLayoutSegments();

  const navigation: NavItem[] = [
    {
      label: "Dashboard",
      active: segments?.length === 1,
      Icon: LayoutDashboard,
    },
    {
      label: "Projects",
      active: segments?.length === 2 && segments[1] === "projects",
      Icon: FolderKanban,
    },
    {
      label: "Inbox",
      Icon: Inbox,
    },
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="gap-y-4 py-4">
        <div className="px-3 py-2 gap-y-4 flex flex-col">
          <IssueCreationSection />
          <div className="gap-y-1">
            {navigation.map((item) => (
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start flex gap-x-2"
                key={item.label}
              >
                <item.Icon aria-hidden className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
