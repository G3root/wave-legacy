"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";

interface StatusTabProps {
  children: ReactNode;
  workspaceId: string;
}

const TabItems = [
  {
    label: "All",
    key: "all",
  },
  {
    label: "Backlog",
    key: "backlog",
    segment: "backlog",
  },
  {
    label: "Active",
    key: "active",
    segment: "active",
  },
  {
    label: "Closed",
    key: "closed",
    segment: "closed",
  },
];

export const StatusTab = ({ children, workspaceId }: StatusTabProps) => {
  const segments = useSelectedLayoutSegment();
  const router = useRouter();
  const defaultValue = segments ?? "all";

  return (
    <Tabs defaultValue={defaultValue} className="h-full space-y-6">
      <div className="space-between flex items-center">
        <TabsList>
          {TabItems.map((item) => (
            <TabsTrigger
              onClick={() => {
                router.push(
                  `/${workspaceId}/projects${
                    item?.segment ? `/${item.segment}` : ""
                  }`
                );
              }}
              value={item.key}
              key={item.key}
              className="relative"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};
