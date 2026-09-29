"use client";

import { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ListChecks,
  Bell,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
} from "lucide-react";

import { WorkspaceProvider, useWorkspaceContext } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/Authcontext";
import { Avatar } from "@/components/ui";

const MENU_ITEMS = [
  { label: "Overview", href: "overview", icon: LayoutDashboard },
  { label: "Projects", href: "projects", icon: FolderKanban },
  { label: "Members", href: "members", icon: Users },
  { label: "Tasks", href: "tasks", icon: ListChecks },
];

const SYSTEM_ITEMS = [
  { label: "Notifications", href: "notifications", icon: Bell },
  { label: "Settings", href: "settings", icon: Settings },
];

function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params.slug as string;
  const { user, logout } = useAuth();
  const { workspace, loading, error } = useWorkspaceContext();
  const [collapsed, setCollapsed] = useState(false);

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
          <h1 className="text-4xl font-bold">Workspace not found</h1>
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

  const isActive = (href: string) => pathname?.includes(`/workspace/${slug}/${href}`);
  const sidebarWidth = collapsed ? "w-[76px]" : "w-64";

  const NavButton = ({
    item,
  }: {
    item: { label: string; href: string; icon: any };
  }) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <button
        onClick={() => router.push(`/workspace/${slug}/${item.href}`)}
        title={collapsed ? item.label : undefined}
        className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          collapsed ? "justify-center" : ""
        } ${
          active
            ? "bg-[#6d5dfb] text-white"
            : "text-white/55 hover:bg-white/[0.06] hover:text-white"
        }`}
      >
        <Icon size={18} className="shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      {/* ============ MOBILE-ONLY HEADER ============ */}
      {/* Completely hidden on desktop (lg:hidden) — mobile relies on this
          top bar + scrollable tab row instead of the sidebar */}
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center gap-2 px-4">
          <button
            onClick={() => router.push("/workspace")}
            className="grid h-8 w-8 place-items-center rounded-lg text-black/50 hover:bg-black/5"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-base font-black tracking-[-.05em]">
            NEXUS<span className="text-[#6d5dfb]">.</span>
          </span>
          <span className="ml-1 truncate text-sm font-semibold text-black/50">
            {workspace.name}
          </span>
        </div>

        <nav className="flex overflow-x-auto border-t border-black/[0.05] px-2">
          {[...MENU_ITEMS, ...SYSTEM_ITEMS].map((tab) => {
            const active = isActive(tab.href);
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.href}
                onClick={() => router.push(`/workspace/${slug}/${tab.href}`)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-medium transition ${
                  active
                    ? "border-[#6d5dfb] text-[#6d5dfb]"
                    : "border-transparent text-black/45 hover:text-black"
                }`}
              >
                <TabIcon size={14} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ============ DESKTOP-ONLY DARK SIDEBAR ============ */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-30 hidden flex-col border-r border-white/[0.06] bg-[#0c0c0e] px-3 py-5 transition-all duration-200 lg:flex ${sidebarWidth}`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          {!collapsed && (
            <button
              onClick={() => router.push("/workspace")}
              className="text-lg font-black tracking-[-.05em] text-white"
            >
              NEXUS<span className="text-[#8b7cff]">.</span>
            </button>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/[0.06] hover:text-white"
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        {!collapsed && (
          <p className="mb-2 truncate px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
            {workspace.name}
          </p>
        )}

        <div className="flex-1 overflow-y-auto">
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
              General
            </p>
          )}
          {MENU_ITEMS.map((item) => (
            <NavButton key={item.href} item={item} />
          ))}

          <div className="my-4 border-t border-white/[0.06]" />

          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
              System
            </p>
          )}
          {SYSTEM_ITEMS.map((item) => (
            <NavButton key={item.href} item={item} />
          ))}

          <button
            onClick={logout}
            title={collapsed ? "Log out" : undefined}
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && "Log out"}
          </button>
        </div>

        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
            <Avatar name={user?.name ?? "?"} size="sm" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">{user?.name}</p>
                <p className="truncate text-[10px] text-white/35">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ============ PAGE CONTENT ============ */}
      <div
        className={`mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:py-10 ${
          collapsed ? "lg:ml-[76px]" : "lg:ml-64"
        }`}
      >
        {children}
      </div>
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