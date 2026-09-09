"use client";

import { useParams } from "next/navigation";
import { ProjectProvider, useProjectContext } from "@/context/ProjectContext";

function ProjectGate({ children }: { children: React.ReactNode }) {
  const { loading, error, project } = useProjectContext();

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-black/5" />
        <div className="mt-8 h-40 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Project not found</h1>
          <p className="mt-2 text-sm text-black/40">{error}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params.slug as string;
  const projectId = params.projectId as string;

  return (
    <ProjectProvider slug={slug} projectId={projectId}>
      <ProjectGate>{children}</ProjectGate>
    </ProjectProvider>
  );
}