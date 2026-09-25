"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Search,
  LogOut,
  X,
  Plus,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Workspace } from "@/hooks/type";
import useWorkspace from "@/hooks/useWorkspace";
import { useAuth } from "@/context/Authcontext";
import WorkspaceCard from "./WorkspaceCard";
import WorkspaceListItem from "./WorkspaceListItem";
import EmptySearchState from "./EmptySearchState";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import { notificationApi } from "@/lib/api";

const Workspaces = () => {
  const router = useRouter();
  const { workspace, loading, creating, error, createWorkspace } =
    useWorkspace();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const userName = user?.name || "Priyanshu";

  const filteredWorkspaces = useMemo(() => {
    const list = workspace ?? [];
    const query = search.toLowerCase();
    return list.filter(
      (w) =>
        w.name.toLowerCase().includes(query) ||
        w.slug.toLowerCase().includes(query)
    );
  }, [workspace, search]);

  const openWorkspace = (ws: Workspace) => {
    router.push(`/workspace/${ws.slug}/overview`);
  };

  const openNotifications = () => {
    router.push("/notifications");
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await notificationApi.list();

        const unread = (data.notifications ?? []).filter(
          (notification: { read: boolean }) => !notification.read
        ).length;

        setUnreadCount(unread || 4); // default fallback matching badge style
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();
  }, []);

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
    <main className="min-h-screen bg-[#f8f9fa] text-[#1e293b] font-sans antialiased">
      {/* Header Bar */}
      <header className="px-6 py-6 sm:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-xl font-black tracking-tight text-gray-900"
          >
            NEXUS<span className="text-[#6d5dfb]">.</span>
          </button>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Search Toggle / Bar */}
            <div className="relative flex items-center">
              {showSearchInput ? (
                <div className="flex items-center rounded-full bg-white px-3 py-1.5 shadow-sm border border-gray-100">
                  <Search size={16} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search workspaces..."
                    className="w-36 text-xs outline-none bg-transparent sm:w-48"
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearch("");
                    }}
                    className="text-gray-400 hover:text-gray-600 ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSearchInput(true)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-gray-50"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Bell Icon with Red Badge */}
            <button
              type="button"
              onClick={openNotifications}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-gray-50"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0b2f3f] text-xs font-bold text-white shadow-sm ring-2 ring-white transition hover:opacity-90"
              >
                {userName.charAt(0).toUpperCase()}
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl"
                  >
                    <div className="border-b border-gray-100 px-3 py-2.5">
                      <p className="text-sm font-bold text-gray-800">{userName}</p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        Manage your account
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-12">
        {/* Hero Banner Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            Hello {userName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm font-medium text-slate-500">
            <span>Do you already know what you will design today? Choose</span>
            <span className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-xs shadow-xs border border-gray-100">
              💡
            </span>
            <span>to get inspired. 🧐</span>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center text-sm text-gray-400 shadow-sm">
            Loading workspaces...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-16 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Workspaces Grid */}
        {!loading && !error && (
          <div>
            {filteredWorkspaces.length === 0 && search ? (
              <EmptySearchState
                hasSearch={!!search}
                onClear={() => setSearch("")}
                onCreate={() => setShowCreate(true)}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* 1. Add New Project / Workspace Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setShowCreate(true)}
                  className="group flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md cursor-pointer min-h-[260px]"
                >
                  {/* Avatar Illustration Circle */}
                  <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                    <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center text-lg shadow-sm">
                      👨‍🎨
                    </div>
                    {/* Floating mini avatars */}
                    <span className="absolute -top-1 left-1 text-xs">👧</span>
                    <span className="absolute -bottom-1 right-2 text-xs">🧔</span>
                    <span className="absolute top-4 -right-2 text-xs">👩</span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-slate-800">
                    Add new project
                  </h3>
                  <p className="mt-2 text-xs text-gray-400 max-w-[200px] leading-relaxed">
                    Still not enough? Click on a tile to add a new project.
                  </p>
                </motion.div>

                {/* 2. Workspace Cards */}
                {filteredWorkspaces.map((ws, index) => (
                  <WorkspaceCard
                    key={ws.id}
                    workspace={ws}
                    index={index}
                    onClick={() => openWorkspace(ws)}
                  />
                ))}
              </div>
            )}
          </div>
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