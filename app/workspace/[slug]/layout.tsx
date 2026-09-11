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

function WorkspaceShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params.slug as string;

  const { workspace, myRole, loading, error } =
    useWorkspaceContext();

  const { user, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  /* ================= CLOSE PROFILE MENU ================= */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  useEffect(() => {
    setShowProfileMenu(false);
  }, [pathname]);

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setShowProfileMenu(false);
      router.push("/login");
    }
  };

  /* ================= LOADING ================= */

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

  /* ================= ERROR ================= */

  if (error || !workspace) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f4]">
        <div className="px-5 text-center">
          <h1 className="text-4xl font-bold">
            Workspace not found
          </h1>

          <p className="mt-2 text-sm text-black/40">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.push("/workspace")}
            className="mt-5 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Back to workspaces
          </button>
        </div>
      </main>
    );
  }

  /* ================= ACTIVE TAB ================= */

  const isTabActive = (href: string) => {
    return (
      pathname === `/workspace/${slug}/${href}` ||
      pathname?.startsWith(
        `/workspace/${slug}/${href}/`,
      )
    );
  };

  /* ================= USER DATA ================= */

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userRole = myRole || "MEMBER";

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
        {/* ================= TOP HEADER ================= */}

        <div className="mx-auto flex h-16 items-center gap-2 px-5 sm:px-8">
          {/* BACK */}

          <button
            type="button"
            onClick={() => router.push("/workspace")}
            className="flex items-center gap-2 text-sm font-medium text-black/50 transition hover:text-black"
            aria-label="Back to workspaces"
          >
            <ArrowLeft size={16} />
          </button>

          {/* LOGO + WORKSPACE */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-lg font-black tracking-[-.05em]"
            >
              NEXUS
              <span className="text-nexus">.</span>
            </button>

            <div className="hidden h-7 w-px bg-black/10 lg:block" />

            <button
              type="button"
              onClick={() => router.push("/workspace")}
              className="hidden items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold transition hover:bg-black/5 sm:flex"
            >
              <span className="max-w-[200px] truncate">
                {workspace.name}
              </span>
            </button>
          </div>

          {/* ================= MOBILE USER ================= */}

          <div
            ref={profileRef}
            className="relative ml-auto lg:hidden"
          >
            <button
              type="button"
              onClick={() =>
                setShowProfileMenu((prev) => !prev)
              }
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-black/5"
              aria-label="Open profile menu"
              aria-expanded={showProfileMenu}
            >
              <Avatar
                name={userName}
                size="sm"
              />

              <div className="hidden max-w-[120px] text-left sm:block">
                <p className="truncate text-xs font-semibold">
                  {userName}
                </p>

                <p className="truncate text-[10px] uppercase text-black/40">
                  {userRole}
                </p>
              </div>

              <ChevronDown
                size={14}
                className={`text-black/40 transition ${
                  showProfileMenu
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* MOBILE PROFILE DROPDOWN */}

            {showProfileMenu && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-[60] w-64 overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
                {/* USER INFO */}

                <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                  <Avatar
                    name={userName}
                    size="md"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {userName}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-black/40">
                      {userEmail}
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#6d5dfb]">
                      {userRole}
                    </p>
                  </div>
                </div>

                <div className="my-1 border-t border-black/[0.06]" />

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                  <LogOut size={16} />

                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            MOBILE NAVIGATION
        ========================================================= */}

        <div className="relative lg:hidden">
          {/* Scrollable tabs */}

          <nav className="flex overflow-x-auto border-t border-black/[0.05] pr-20 pl-3 scrollbar-none">
            {TABS.map((tab) => {
              const active = isTabActive(tab.href);
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.href}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/workspace/${slug}/${tab.href}`,
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

          {/* Mobile profile floating area */}

          <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white via-white/95 to-transparent" />
        </div>
      </header>

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}

      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-64 border-r border-black/[0.06] bg-white/80 px-3 py-5 backdrop-blur lg:block">
        {/* SIDEBAR TITLE */}

        <div className="mb-5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#aaa]">
          Workspace
        </div>

        {/* MAIN NAVIGATION */}

        {TABS.map((tab) => {
          const active = isTabActive(tab.href);
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.href}
              type="button"
              onClick={() =>
                router.push(
                  `/workspace/${slug}/${tab.href}`,
                )
              }
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#6D5DFB]/10 text-[#6D5DFB]"
                  : "text-[#666] hover:bg-black/5 hover:text-black"
              }`}
            >
              <TabIcon size={18} />

              {tab.label}
            </button>
          );
        })}

        {/* DIVIDER */}

        <div className="my-5 border-t border-black/5" />

        {/* NOTIFICATIONS */}

        <button
          type="button"
          onClick={() =>
            router.push("/notifications")
          }
          className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#666] transition hover:bg-black/5 hover:text-black"
        >
          <Bell size={17} />

          Notifications
        </button>

        {/* SETTINGS */}

        <button
          type="button"
          onClick={() =>
            router.push(
              `/workspace/${slug}/settings/general`,
            )
          }
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#666] transition hover:bg-black/5 hover:text-black"
        >
          <Settings size={17} />

          Settings
        </button>

        {/* =======================================================
            DESKTOP USER PROFILE
        ======================================================= */}

        <div
          ref={profileRef}
          className="absolute bottom-4 left-3 right-3"
        >
          <div className="relative">
            {/* PROFILE BUTTON */}

            <button
              type="button"
              onClick={() =>
                setShowProfileMenu((prev) => !prev)
              }
              className="flex w-full items-center gap-3 rounded-2xl bg-black/[0.03] p-3 text-left transition hover:bg-black/[0.06]"
              aria-label="Open profile menu"
              aria-expanded={showProfileMenu}
            >
              <Avatar
                name={userName}
                size="sm"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">
                  {userName}
                </p>

                <p className="truncate text-[10px] uppercase text-[#888]">
                  {userRole}
                </p>
              </div>

              <ChevronDown
                size={14}
                className={`shrink-0 text-black/40 transition ${
                  showProfileMenu
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* DESKTOP PROFILE DROPDOWN */}

            {showProfileMenu && (
              <div className="absolute bottom-[calc(100%+10px)] left-0 right-0 z-50 overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
                {/* USER INFO */}

                <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                  <Avatar
                    name={userName}
                    size="md"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {userName}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-black/40">
                      {userEmail}
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#6d5dfb]">
                      {userRole}
                    </p>
                  </div>
                </div>

                <div className="my-1 border-t border-black/[0.06]" />

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                  <LogOut size={16} />

                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* =========================================================
          PAGE CONTENT
      ========================================================= */}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:ml-64 lg:py-10">
        {children}
      </div>
    </main>
  );
}

/* ===============================================================
   WORKSPACE LAYOUT
================================================================ */

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