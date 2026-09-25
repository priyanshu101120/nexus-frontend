"use client";

import { useParams } from "next/navigation";
import { FolderKanban, AlertCircle } from "lucide-react";
import { ProjectProvider, useProjectContext } from "@/context/ProjectContext";

function ProjectGate({ children }: { children: React.ReactNode }) {
  const { loading, error, project } = useProjectContext();

  if (loading) {
    return (
      <div className="-m-6 min-h-screen bg-[#f4f5f9] p-6 lg:p-8 font-sans">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-8 w-64 animate-pulse rounded-2xl bg-slate-200" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-24 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-10 w-32 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
          {/* Main Card Skeleton */}
          <div className="h-48 animate-pulse rounded-[32px] bg-white shadow-sm border border-slate-100" />
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 h-80 animate-pulse rounded-[32px] bg-white shadow-sm" />
            <div className="lg:col-span-4 h-80 animate-pulse rounded-[32px] bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="-m-6 min-h-[85vh] flex items-center justify-center bg-[#f4f5f9] p-6">
        <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-xl border border-slate-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertCircle size={28} />
          </div>
          <h1 className="mt-4 text-xl font-black text-slate-900">Project Not Found</h1>
          <p className="mt-1.5 text-xs font-semibold text-slate-400">
            {error || "The project you are looking for does not exist or has been moved."}
          </p>
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