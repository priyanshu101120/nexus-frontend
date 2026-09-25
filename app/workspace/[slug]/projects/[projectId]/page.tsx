import ProjectDetail from "@/components/project/ProjectDetail";
import { ProjectProvider } from "@/context/ProjectContext";

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
    projectId: string;
  }>;
}) {
  const { slug, projectId } = await params;

  return (
    <ProjectProvider slug={slug} projectId={projectId}>
      <ProjectDetail />
    </ProjectProvider>
  );
}