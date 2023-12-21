import { getRequiredNextAuthSession } from "@/lib/next-auth/get-server-component-session";
import { Separator } from "../../ui/separator";
import { NewProjectDialog } from "./new-project-dialog";

export async function PageHeader() {
  const session = await getRequiredNextAuthSession();
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Projects</h3>
        <NewProjectDialog workspaceId={session.user.wsPbId} />
      </div>
      <div className="py-4">
        <Separator />
      </div>
    </>
  );
}
