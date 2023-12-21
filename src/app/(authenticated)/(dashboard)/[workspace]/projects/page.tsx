import { PageHeader } from "@/components/projects/page-header";
import { getRequiredNextAuthSession } from "@/lib/next-auth/get-server-component-session";

export default async function WorkspacePage({
  params,
}: {
  params: { workspace: string };
}) {
  const session = await getRequiredNextAuthSession();

  if (params.workspace !== session.user.wsPbId) {
    throw new Error("unauthorized");
  }
  return <PageHeader />;
}
