import { ProjectDetail } from "@/components/workspace-pages";
export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const p = await params;
  return <ProjectDetail projectId={p.projectId} />;
}
