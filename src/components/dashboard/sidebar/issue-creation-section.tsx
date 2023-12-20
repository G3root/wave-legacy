import { Button } from "@/components/ui/button";
import { PenSquare, Search } from "lucide-react";

export function IssueCreationSection() {
  return (
    <div className="flex items-center gap-x-2">
      <Button className="w-full justify-start flex gap-x-2" variant="outline">
        <PenSquare aria-hidden className=" h-4 w-4" />
        New issue
      </Button>

      <Button className="px-2.5 py-2.5" variant="outline">
        <Search aria-hidden className=" h-4 w-4" />
      </Button>
    </div>
  );
}
