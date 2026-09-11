"use client";

import { useWorkspaceContext } from "@/context/WorkspaceContext";

import useProject from "@/hooks/useProject";

export default function WorkspaceOverviewPage() {
  const { projects } = useProject();
  const { workspace, members } = useWorkspaceContext();

  if (!workspace) return null;

  return (
    <section className="bg-grid">
      <div className="pointer-events-none absolute left-[10%] top-32 h-72 w-72 rounded-full bg-[#8b7cff]/20 blur-[100px]" />

      {/* Blue glow */}
      <div className="pointer-events-none absolute right-[8%] top-56 h-80 w-80 rounded-full bg-[#8bd8ff]/20 blur-[110px]" />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d5dfb]">
        Workspace
      </p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">
        {workspace.name}
      </h1>
      <p className="mt-2 text-sm text-black/40">/{workspace.slug}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
          <p className="text-xs text-black/40">Projects</p>
          <p className="mt-2 text-3xl font-black">{projects.length}</p>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
          <p className="text-xs text-black/40">Members</p>
          <p className="mt-2 text-3xl font-black">{members.length}</p>
        </div>
      </div>
    </section>
  );
}
