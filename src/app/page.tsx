import { getNextAuthSession } from "@/lib/next-auth/get-server-component-session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getNextAuthSession();

  if (session?.user) {
    redirect(`/${session.user.wsId}`);
  }

  return <main className="text-red-800">hello world</main>;
}
