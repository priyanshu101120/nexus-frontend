"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, FolderKanban, Users, Settings } from "lucide-react";
import { WorkspaceProvider, useWorkspaceContext } from "@/context/WorkspaceContext";

const TABS = [
  { label: "Overview", href: "overview", icon: LayoutDashboard },
  { label: "Projects", href: "projects", icon: FolderKanban },
  { label: "Members", href: "members", icon: Users },
  { label: "Settings", href: "settings", icon: Settings },
];

function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params.slug as string;
  const { workspace, loading, error } = useWorkspaceContext();

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

  if (error || !workspace) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f4]">
        <div className="text-center">
          <h1 className="text-xl font-bold">Workspace not found</h1>
          <p className="mt-2 text-sm text-black/40">{error}</p>
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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            onClick={() => router.push("/workspace")}
            className="flex items-center gap-2 text-sm font-medium text-black/50 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            {workspace.name}
          </button>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-1 px-5 sm:px-8">
          {TABS.map((tab) => {
            const active = pathname?.includes(`/workspace/${slug}/${tab.href}`);
            const Icon = tab.icon;
            return (
              <button
                key={tab.href}
                onClick={() => router.push(`/workspace/${slug}/${tab.href}`)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "border-[#6d5dfb] text-[#6d5dfb]"
                    : "border-transparent text-black/45 hover:text-black"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">{children}</div>
    </main>
  );
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <WorkspaceProvider slug={slug}>
      <WorkspaceShell>{children}</WorkspaceShell>
    </WorkspaceProvider>
  );
}