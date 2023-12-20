import { getRequiredNextAuthSession } from "@/lib/next-auth/get-server-component-session";

export default async function WorkspacePage({
  params,
}: {
  params: { workspace: string };
}) {
  const session = await getRequiredNextAuthSession();

  if (params.workspace !== session.user.wsId) {
    throw new Error("unauthorized");
  }

  return <main className="text-red-800">hello world</main>;
}
