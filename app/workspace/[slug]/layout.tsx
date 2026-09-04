"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  Bell,
} from "lucide-react";

import {
  WorkspaceProvider,
  useWorkspaceContext,
} from "@/context/WorkspaceContext";

import { Avatar } from "@/components/ui";

const TABS = [
  {
    label: "Overview",
    href: "overview",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "projects",
    icon: FolderKanban,
  },
  {
    label: "Members",
    href: "members",
    icon: Users,
  },
  {
    label: "Settings",
    href: "settings",
    icon: Settings,
  },
];

function WorkspaceShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const slug = params.slug as string;

  const {
    workspace,
    loading,
    error,
  } = useWorkspaceContext();

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
          <h1 className="text-4xl font-bold">
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

      {/* ================= HEADER ================= */}

      <header className="border-b border-black/[0.06] bg-white">

        {/* Workspace name */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

          <button
            onClick={() => router.push("/workspace")}
            className="flex items-center gap-2 text-sm font-medium text-black/50 transition hover:text-black"
          >
            <ArrowLeft size={16} />

            <span className="truncate max-w-[200px]">
              {workspace.name}
            </span>
          </button>

        </div>

        {/* ================= MOBILE NAV ================= */}

        <nav className="flex overflow-x-auto border-t border-black/[0.05] px-3 lg:hidden">
          {TABS.map((tab) => {
            const active = pathname?.includes(
              `/workspace/${slug}/${tab.href}`
            );

            const TabIcon = tab.icon;

            return (
              <button
                key={tab.href}
                onClick={() =>
                  router.push(
                    `/workspace/${slug}/${tab.href}`
                  )
                }
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "border-[#6d5dfb] text-[#6d5dfb]"
                    : "border-transparent text-black/45 hover:text-black"
                }`}
              >
                <TabIcon size={15} />

                {tab.label}
              </button>
            );
          })}
        </nav>

      </header>

      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside className="fixed bottom-0 left-0 top-16 hidden w-64 border-r border-black/[0.06] bg-white/80 px-3 py-5 backdrop-blur lg:block">

        <div className="mb-5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#aaa]">
          Workspace
        </div>

        {/* Main navigation */}

        {TABS.map((tab) => {
          const active = pathname?.includes(
            `/workspace/${slug}/${tab.href}`
          );

          const TabIcon = tab.icon;

          return (
            <button
              key={tab.href}
              onClick={() =>
                router.push(
                  `/workspace/${slug}/${tab.href}`
                )
              }
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#6D5DFB]/10 text-[#6D5DFB]"
                  : "text-[#666] hover:bg-black/5"
              }`}
            >
              <TabIcon size={18} />

              {tab.label}
            </button>
          );
        })}

        {/* Divider */}

        <div className="my-5 border-t border-black/5" />

        {/* Notifications */}

        <button
          onClick={() =>
            router.push(
              `/workspace/${slug}/notifications`
            )
          }
          className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#666] transition hover:bg-black/5"
        >
          <Bell size={17} />

          Notifications
        </button>

        {/* Settings */}

        <button
          onClick={() =>
            router.push(
              `/workspace/${slug}/settings`
            )
          }
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#666] transition hover:bg-black/5"
        >
          <Settings size={17} />

          Settings
        </button>

        {/* User */}

        <div className="absolute bottom-4 left-3 right-3">
          <div className="rounded-2xl bg-black/[0.03] p-3">
            <div className="flex items-center gap-2">

              <Avatar
                name="Priyanshu"
                size="sm"
              />

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">
                  Priyanshu
                </p>

                <p className="truncate text-[10px] text-[#888]">
                  Owner
                </p>
              </div>

            </div>
          </div>
        </div>

      </aside>

      {/* ================= PAGE CONTENT ================= */}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:ml-64 lg:py-10">
        {children}
      </div>

    </main>
  );
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  const slug = params.slug as string;

  return (
    <WorkspaceProvider slug={slug}>
      <WorkspaceShell>
        {children}
      </WorkspaceShell>
    </WorkspaceProvider>
  );
}