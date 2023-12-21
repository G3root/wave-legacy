import { TabsContent } from "@/components/ui/tabs";

export default async function ClosedPage() {
  return (
    <TabsContent value="closed" className="border-none p-0 outline-none">
      hello closed
    </TabsContent>
  );
}
