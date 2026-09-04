"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  Grid2X2,
  List,
  Plus,
  Search,
  LogOut,
  X,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Workspace, CreateWorkspaceInput } from "@/hooks/type";
import useWorkspace from "@/hooks/useWorkspace";
import { useAuth } from "@/context/Authcontext";
import WorkspaceCard from "./WorkspaceCard";
import WorkspaceListItem from "./WorkspaceListItem";
import EmptySearchState from "./EmptySearchState";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

const Workspaces = () => {
  const router = useRouter();
  const { workspace, loading, creating, error, createWorkspace } =
    useWorkspace();
  const { logout } = useAuth();
  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showCreate, setShowCreate] = useState(false);
   const filteredWorkspaces = useMemo(() => {
      const list = workspace ?? [];
      const query = search.toLowerCase();
      return list.filter(
        (w) =>
          w.name.toLowerCase().includes(query) ||
          w.slug.toLowerCase().includes(query),
      );
    }, [workspace, search]);
  
    const openWorkspace = (ws: Workspace) => {
      router.push(`/workspace/${ws.slug}/overview`);
    };
  
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
   return (
      <main className="min-h-screen bg-[#f7f7f4] text-[#111] grid-bg">
        <div className="pointer-events-none absolute left-[10%] top-32 h-72 w-72 rounded-full bg-[#8b7cff]/20 blur-[100px]" />
  
        {/* Blue glow */}
        <div className="pointer-events-none absolute right-[8%] top-56 h-80 w-80 rounded-full bg-[#8bd8ff]/20 blur-[110px]" />
        {/* Header */}
        <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
            <button
              onClick={() => router.push("/")}
              className="text-xl font-black tracking-[-0.06em]"
            >
              NEXUS<span className="text-[#6d5dfb]">.</span>
            </button>
  
            <div className="flex items-center gap-3">
              <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-black/[0.07] bg-white transition hover:bg-black/[0.025]">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#6d5dfb]" />
              </button>
  
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-black/[0.07] bg-white px-2 py-1.5 transition hover:border-black/[0.12] hover:bg-black/[0.02]"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#111] text-[10px] font-bold text-white">
                    P
                  </div>
  
                  <ChevronDown
                    size={15}
                    className={`text-black/40 transition-transform ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>
  
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
                    >
                      <div className="border-b border-black/[0.06] px-3 py-2.5">
                        <p className="text-sm font-semibold">Profile</p>
                        <p className="mt-0.5 text-xs text-black/40">
                          Manage your account
                        </p>
                      </div>
  
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
  
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#6d5dfb]">
                Your workspaces
              </p>
             
            </div>
  
            <button
              onClick={() => setShowCreate(true)}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#111] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
            >
              <Plus size={17} />
              Create workspace
            </button>
          </motion.div>
  
          {/* Toolbar */}
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search workspaces..."
                className="h-11 w-full rounded-xl border border-black/[0.07] bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#6d5dfb]/40 focus:ring-4 focus:ring-[#6d5dfb]/5"
              />
            </div>
  
            <div className="flex items-center self-end rounded-xl border border-black/[0.07] bg-white p-1">
              <button
                onClick={() => setView("grid")}
                className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                  view === "grid"
                    ? "bg-black text-white"
                    : "text-black/40 hover:text-black"
                }`}
              >
                <Grid2X2 size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                  view === "list"
                    ? "bg-black text-white"
                    : "text-black/40 hover:text-black"
                }`}
              >
                <List size={17} />
              </button>
            </div>
          </div>
  
          {/* Loading / Error states */}
          {loading && (
            <div className="rounded-2xl border border-black/[0.07] bg-white px-6 py-16 text-center text-sm text-black/40">
              Loading workspaces...
            </div>
          )}
  
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center text-sm text-red-600">
              {error}
            </div>
          )}
  
          {/* All workspaces */}
          {!loading && !error && (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-sm font-bold">
                  {search ? "Search results" : "All workspaces"}
                </h2>
                <span className="text-xs text-black/35">
                  {filteredWorkspaces.length} workspaces
                </span>
              </div>
  
              {filteredWorkspaces.length > 0 ? (
                view === "grid" ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredWorkspaces.map((ws, index) => (
                      <WorkspaceCard
                        key={ws.id}
                        workspace={ws}
                        index={index}
                        onClick={() => openWorkspace(ws)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredWorkspaces.map((ws, index) => (
                      <WorkspaceListItem
                        key={ws.id}
                        workspace={ws}
                        index={index}
                        onClick={() => openWorkspace(ws)}
                      />
                    ))}
                  </div>
                )
              ) : (
                <EmptySearchState
                  hasSearch={!!search}
                  onClear={() => setSearch("")}
                  onCreate={() => setShowCreate(true)}
                />
              )}
            </section>
          )}
  
         
        </div>
  
        {/* Create Workspace Modal */}
        <AnimatePresence>
          {showCreate && (
            <CreateWorkspaceModal
              creating={creating}
              error={error}
              onCreate={createWorkspace}
              onClose={() => setShowCreate(false)}
            />
          )}
        </AnimatePresence>
      </main>
    );
};

export default Workspaces;
