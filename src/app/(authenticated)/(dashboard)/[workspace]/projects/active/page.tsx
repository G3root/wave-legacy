import { TabsContent } from "@/components/ui/tabs";

export default async function ActivePage() {
  return (
    <TabsContent value="active" className="border-none p-0 outline-none">
      hello active
    </TabsContent>
  );
}
