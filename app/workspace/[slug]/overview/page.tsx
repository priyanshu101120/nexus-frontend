"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useWorkspace from "@/hooks/useWorkspace";
import { useEffect, useState } from "react";

export default function WorkspaceOverviewPage() {
  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;

  const { getWorkspaceBySlug, loading, error } = useWorkspace();

  const [workspace, setWorkspace] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchWorkspace = async () => {
      try {
        const data = await getWorkspaceBySlug(slug);

        console.log("WORKSPACE BY SLUG:", data);

        setWorkspace(data.workspace);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkspace();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f4] p-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-black/5" />

          <div className="mt-8 h-40 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f4]">
        <div className="text-center">
          <h1 className="text-xl font-bold">
            Workspace not found
          </h1>

          <p className="mt-2 text-sm text-black/40">
            {error}
          </p>

          <button
            onClick={() => router.push("/workspace")}
            className="mt-5 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to workspaces
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      <header className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-5 sm:px-8">
          <button
            onClick={() => router.push("/workspace")}
            className="flex items-center gap-2 text-sm font-medium text-black/50 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Workspaces
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d5dfb]">
          Workspace
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight">
          {workspace?.name}
        </h1>

        <p className="mt-2 text-sm text-black/40">
          /{workspace?.slug}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
            <p className="text-xs text-black/40">
              Projects
            </p>

            <p className="mt-2 text-3xl font-black">
              {workspace?.projects?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
            <p className="text-xs text-black/40">
              Tasks
            </p>

            <p className="mt-2 text-3xl font-black">
              {workspace?.tasks?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
            <p className="text-xs text-black/40">
              Members
            </p>

            <p className="mt-2 text-3xl font-black">
              {workspace?.members?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}