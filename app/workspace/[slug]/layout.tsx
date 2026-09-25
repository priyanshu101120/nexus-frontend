"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  Bell,
  ListTodo,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  WorkspaceProvider,
  useWorkspaceContext,
} from "@/context/WorkspaceContext";
import { useAuth } from "@/context/Authcontext";
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
    label: "Tasks",
    href: "tasks",
    icon: ListTodo,
  },
];

function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params.slug as string;

  const { workspace, myRole, loading, error } = useWorkspaceContext();
  const { user, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  /* Dropdown ke bahar click hone par menu close karna */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Page change hone par menu close karna */
  useEffect(() => {
    setShowProfileMenu(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setShowProfileMenu(false);
      router.push("/login");
    }
  };

  /* Skeleton Loading State */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f4] p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 animate-pulse rounded-xl bg-black/5" />
            <div className="h-10 w-10 animate-pulse rounded-full bg-black/5" />
          </div>
          <div className="h-44 w-full animate-pulse rounded-3xl border border-black/[0.04] bg-white/60" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-black/[0.04] bg-white/60"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* Error State */
  if (error || !workspace) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f4] px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Settings size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-black">
            Workspace not found
          </h1>
          <p className="mt-2 text-sm text-black/50">
            {error ||
              "The workspace you are trying to access does not exist or you don't have permission."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/workspace")}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#111] px-6 text-sm font-semibold text-white transition hover:bg-black"
          >
            Back to workspaces
          </button>
        </div>
      </main>
    );
  }

  const isTabActive = (href: string) => {
    return (
      pathname === `/workspace/${slug}/${href}` ||
      pathname?.startsWith(`/workspace/${slug}/${href}/`)
    );
  };

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userRole = myRole || "MEMBER";

  return (
    <main className="min-h-screen bg-[#f7f7f4] font-sans text-slate-900 selection:bg-[#6d5dfb]/20">
      {/* Background Ambient Glow Effect */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-[#8b7cff]/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#8bd8ff]/10 blur-[140px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Left: Navigation & Workspace Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.push("/workspace")}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-black/60 shadow-sm transition hover:bg-black/5 hover:text-black"
              aria-label="Back to workspaces"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-lg font-black tracking-tighter"
              >
                NEXUS<span className="text-[#6d5dfb]">.</span>
              </button>

              <span className="hidden h-4 w-px bg-black/10 lg:block" />

              <div className="hidden items-center gap-2 rounded-xl bg-black/[0.03] px-3 py-1.5 text-xs font-semibold text-black/80 lg:flex">
                <span className="h-2 w-2 rounded-full bg-[#6d5dfb]" />
                <span className="max-w-[180px] truncate">{workspace.name}</span>
              </div>
            </div>
          </div>

          {/* Right: Mobile Profile & Notification */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/notifications")}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-black/60 shadow-sm transition hover:bg-black/5 hover:text-black lg:hidden"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#6d5dfb]" />
            </button>

            {/* Mobile Profile Menu */}
            <div ref={profileRef} className="relative lg:hidden">
              <button
                type="button"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white p-1.5 shadow-sm transition hover:bg-black/5"
              >
                <Avatar name={userName} size="sm" />
                <ChevronDown
                  size={14}
                  className={`text-black/40 transition-transform ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-2 shadow-2xl">
                  <div className="flex items-center gap-3 rounded-xl bg-black/[0.02] p-3">
                    <Avatar name={userName} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-black">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-black/40">
                        {userEmail}
                      </p>
                      <span className="mt-1 inline-block rounded-md bg-[#6d5dfb]/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#6d5dfb]">
                        {userRole}
                      </span>
                    </div>
                  </div>

                  <div className="my-1 border-t border-black/[0.06]" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Tabs */}
        <div className="border-t border-black/[0.05] lg:hidden">
          <nav className="flex overflow-x-auto px-4 scrollbar-none">
            {TABS.map((tab) => {
              const active = isTabActive(tab.href);
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.href}
                  type="button"
                  onClick={() => router.push(`/workspace/${slug}/${tab.href}`)}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition ${
                    active
                      ? "border-[#6d5dfb] text-[#6d5dfb]"
                      : "border-transparent text-black/50 hover:text-black"
                  }`}
                >
                  <TabIcon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-64 border-r border-black/[0.06] bg-white/70 px-4 py-6 backdrop-blur-xl lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-6">
          <div>
            <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/35">
              Menu
            </p>
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const active = isTabActive(tab.href);
                const TabIcon = tab.icon;

                return (
                  <button
                    key={tab.href}
                    type="button"
                    onClick={() =>
                      router.push(`/workspace/${slug}/${tab.href}`)
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                      active
                        ? "bg-[#6d5dfb] text-white shadow-lg shadow-[#6d5dfb]/25"
                        : "text-black/60 hover:bg-black/[0.04] hover:text-black"
                    }`}
                  >
                    <TabIcon size={17} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/35">
              System
            </p>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => router.push("/notifications")}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-black/60 transition hover:bg-black/[0.04] hover:text-black"
              >
                <Bell size={17} />
                Notifications
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(`/workspace/${slug}/settings/general`)
                }
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-black/60 transition hover:bg-black/[0.04] hover:text-black"
              >
                <Settings size={17} />
                Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Desktop Profile Card & Popup Menu */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/80 p-3 text-left shadow-sm transition hover:bg-white hover:shadow-md"
          >
            <Avatar name={userName} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-black">
                {userName}
              </p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-black/40">
                {userRole}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-black/40 transition-transform ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute bottom-[calc(100%+10px)] left-0 right-0 z-50 overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-2 shadow-2xl">
              <div className="mb-1 rounded-xl bg-black/[0.02] p-3">
                <p className="truncate text-xs font-bold text-black">
                  {userName}
                </p>
                <p className="truncate text-[11px] text-black/40">
                  {userEmail}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={15} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:ml-64 lg:py-8">
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
      <WorkspaceShell>{children}</WorkspaceShell>
    </WorkspaceProvider>
  );
}