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
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Workspace, CreateWorkspaceInput } from "@/hooks/type";
import useWorkspace from "@/hooks/useWorkspace";

export default function WorkspacePage() {
  const router = useRouter();
  const { workspace, loading, creating, error, createWorkspace } =
    useWorkspace();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showCreate, setShowCreate] = useState(false);

  // Only `name` and `slug` actually exist on the backend Workspace shape —
  // search/filter against those, nothing else.
  const filteredWorkspaces = useMemo(() => {
    const query = search.toLowerCase();
    return workspace.filter(
      (w) =>
        w.name.toLowerCase().includes(query) ||
        w.slug.toLowerCase().includes(query),
    );
  }, [workspace, search]);

  const openWorkspace = (ws: Workspace) => {
    router.push(`/workspace/${ws.slug}/overview`);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#111]">
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

            <button className="flex items-center gap-2 rounded-xl border border-black/[0.07] bg-white px-2 py-1.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#111] text-[10px] font-bold text-white">
                P
              </div>
              <ChevronDown size={15} className="text-black/40" />
            </button>
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
            <h1 className="text-4xl font-black tracking-[-0.055em] sm:text-5xl">
              Where do you want
              <br className="hidden sm:block" /> to work?
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-black/50">
              Choose a workspace to continue working with your team, projects
              and tasks.
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
              <EmptySearchState
                hasSearch={!!search}
                onClear={() => setSearch("")}
                onCreate={() => setShowCreate(true)}
              />
            )}
          </section>
        )}

        {/* Bottom tip */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-black/[0.06] bg-[#111] p-6 text-white sm:p-8">
          <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#9b91ff]">
                Nexus tip
              </p>
              <h3 className="text-lg font-bold">
                Keep every project in one workspace.
              </h3>
              <p className="mt-1 text-sm text-white/45">
                Give your team one calm place to plan, build and ship.
              </p>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Create one
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
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
}

/* ---------------------------------- */
/* Workspace Card */
/* ---------------------------------- */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function WorkspaceCard({
  workspace,
  index,
  onClick,
}: {
  workspace: Workspace;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.025)] transition duration-300 hover:-translate-y-1 hover:border-black/[0.12] hover:shadow-[0_20px_50px_rgba(0,0,0,0.07)]"
    >
      <div className="relative">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[#6d5dfb] text-sm font-black text-white shadow-lg">
          {workspace.name.slice(0, 2).toUpperCase()}
        </div>

        <h3 className="text-lg font-bold tracking-tight">{workspace.name}</h3>
        <p className="mt-1 text-sm text-black/45">/{workspace.slug}</p>

        <div className="mt-6 flex items-center gap-4 border-t border-black/[0.06] pt-4 text-xs text-black/40">
          <span>Created {formatDate(workspace.createdAt)}</span>
        </div>

        <div className="absolute bottom-0 right-0 grid h-8 w-8 translate-x-2 translate-y-2 place-items-center rounded-full bg-black text-white opacity-0 transition group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowRight size={15} />
        </div>
      </div>
    </motion.button>
  );
}

/* ---------------------------------- */
/* List Item */
/* ---------------------------------- */

function WorkspaceListItem({
  workspace,
  index,
  onClick,
}: {
  workspace: Workspace;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-black/[0.07] bg-white p-4 text-left transition hover:border-black/[0.12] hover:shadow-lg"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#6d5dfb] text-xs font-black text-white">
        {workspace.name.slice(0, 2).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold">{workspace.name}</h3>
        <p className="mt-0.5 truncate text-xs text-black/40">
          /{workspace.slug}
        </p>
      </div>

      <div className="hidden items-center gap-5 text-xs text-black/40 sm:flex">
        <span>Created {formatDate(workspace.createdAt)}</span>
      </div>

      <ArrowRight
        size={16}
        className="text-black/25 transition group-hover:translate-x-1 group-hover:text-black"
      />
    </motion.button>
  );
}

/* ---------------------------------- */
/* Empty Search */
/* ---------------------------------- */

function EmptySearchState({
  hasSearch,
  onClear,
  onCreate,
}: {
  hasSearch: boolean;
  onClear: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 bg-white px-6 py-16 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-black/[0.035]">
        <Search size={20} className="text-black/35" />
      </div>

      {hasSearch ? (
        <>
          <h3 className="mt-4 font-bold">No workspaces found</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-black/40">
            Try searching for another workspace name.
          </p>
          <button
            onClick={onClear}
            className="mt-5 text-sm font-semibold text-[#6d5dfb]"
          >
            Clear search
          </button>
        </>
      ) : (
        <>
          <h3 className="mt-4 font-bold">No workspaces yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-black/40">
            Create your first workspace to get started.
          </p>
          <button
            onClick={onCreate}
            className="mt-5 text-sm font-semibold text-[#6d5dfb]"
          >
            Create workspace
          </button>
        </>
      )}
    </div>
  );
}

/* ---------------------------------- */
/* Create Modal */
/* ---------------------------------- */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function CreateWorkspaceModal({
  creating,
  error,
  onCreate,
  onClose,
}: {
  creating: boolean;
  error: string | null;
  onCreate: (payload: CreateWorkspaceInput) => Promise<any>;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    const result = await onCreate({ name: name.trim(), slug: slug.trim() });
    if (result) onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-md rounded-3xl border border-black/[0.06] bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d5dfb]">
              New workspace
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Create a workspace
            </h2>
            <p className="mt-1 text-sm text-black/45">
              Start a new space for your team and projects.
            </p>
          </div>

          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-black/40 hover:bg-black/[0.04] hover:text-black"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">
              Workspace name
            </span>
            <input
              autoFocus
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Nexus Studio"
              className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3.5 text-sm outline-none transition focus:border-[#6d5dfb]/40 focus:bg-white focus:ring-4 focus:ring-[#6d5dfb]/5"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">
              Workspace URL
            </span>
            <div className="flex items-center rounded-xl border border-black/[0.08] bg-[#fafafa] pl-3.5 text-sm focus-within:border-[#6d5dfb]/40 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6d5dfb]/5">
              <span className="text-black/35">nexus.app/</span>
              <input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="my-workspace"
                className="h-11 w-full bg-transparent px-1.5 outline-none"
              />
            </div>
          </label>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!name.trim() || !slug.trim() || creating}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#111] text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {creating ? "Creating..." : "Create workspace"}
            {!creating && <ArrowRight size={15} />}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
