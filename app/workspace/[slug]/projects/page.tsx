"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { projectApi } from "@/lib/api";
import { Project, CreateProjectInput } from "@/hooks/type";

export default function ProjectsPage() {
  const { workspace } = useWorkspaceContext();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadProjects = async () => {
    if (!workspace) return;
    try {
      setLoading(true);
      const data = await projectApi.list(workspace.slug);
      setProjects(data.projects ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [workspace]);

  const handleCreate = async (payload: CreateProjectInput) => {
    if (!workspace) return null;
    const data = await projectApi.create(workspace.slug, payload);
    setProjects((prev) => [data.project, ...prev]);
    return data;
  };

  if (!workspace) return null;

  return (
    <>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d5dfb]">
            Projects
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            {workspace.name}'s projects
          </h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex h-11 items-center gap-2 rounded-xl bg-[#111] px-4 text-sm font-semibold text-white transition hover:bg-black"
        >
          <Plus size={16} />
          New project
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white px-6 py-16 text-center">
          <h3 className="font-bold">No projects yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-black/40">
            Create your first project to start organizing tasks on a board.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-5 text-sm font-semibold text-[#6d5dfb]"
          >
            Create project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => router.push(`/workspace/${workspace.slug}/projects/${p.id}`)}
              className="group rounded-2xl border border-black/[0.07] bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="mb-4 h-10 w-10 rounded-xl"
                style={{ backgroundColor: p.color || "#6d5dfb" }}
              />
              <h3 className="font-bold">{p.name}</h3>
              {p.description && (
                <p className="mt-1 line-clamp-2 text-sm text-black/45">{p.description}</p>
              )}
              <div className="mt-4 flex items-center justify-between text-xs text-black/35">
                <span>Open board</span>
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateProjectModal onCreate={handleCreate} onClose={() => setShowCreate(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function CreateProjectModal({
  onCreate,
  onClose,
}: {
  onCreate: (payload: CreateProjectInput) => Promise<any>;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setCreating(true);
      setError(null);
      await onCreate({ name: name.trim(), description: description.trim() || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-md rounded-3xl border border-black/[0.06] bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-black">New project</h2>
          <button onClick={onClose} className="text-black/40 hover:text-black">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Project name</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cartora"
              className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3.5 text-sm outline-none focus:border-[#6d5dfb]/40 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Description (optional)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-black/[0.08] bg-[#fafafa] p-3.5 text-sm outline-none focus:border-[#6d5dfb]/40 focus:bg-white"
            />
          </label>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!name.trim() || creating}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#111] text-sm font-semibold text-white transition hover:bg-black disabled:opacity-40"
          >
            {creating ? "Creating..." : "Create project"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}