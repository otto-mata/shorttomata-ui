import { redirect } from "next/navigation";

export default async function Profile({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`http://localhost:8080/${code}`);
}

export const instant = false;
