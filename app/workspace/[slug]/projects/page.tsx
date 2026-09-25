"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowRight,
  X,
  Search,
  Bell,
  ChevronDown,
  MoreVertical,
  FolderKanban,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
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
    <div className="-m-6 min-h-screen bg-[#f4f5f9] p-6 lg:p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* TOP NAVBAR / HEADER CONTROL BAR */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search project here..."
              className="w-full rounded-2xl border-none bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6d5dfb]/30"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-amber-500" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
              <FolderKanban size={18} />
            </button>

            <button
              onClick={() => setShowCreate(true)}
              className="flex h-10 items-center gap-2 rounded-2xl bg-[#6d5dfb] px-4 text-xs font-bold text-white shadow-md shadow-[#6d5dfb]/20 transition hover:bg-[#5b4be3]"
            >
              <Plus size={16} />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* MAIN TWO COLUMN LAYOUT (Projects + Right Sidebar Widget) */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* LEFT 8 COLUMNS: Projects Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  My Projects
                </h1>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  {workspace.name}'s active workspace repositories
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Sort By</span>
                <button className="flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-slate-800 shadow-sm border border-slate-100">
                  Recent Project <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-44 animate-pulse rounded-[28px] bg-white border border-slate-100" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#6d5dfb]">
                  <Sparkles size={24} />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">No projects yet</h3>
                <p className="mx-auto mt-1 max-w-sm text-xs font-medium text-slate-400">
                  Create your first project to start organizing tasks on a board.
                </p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6d5dfb] px-4 py-2 text-xs font-bold text-white shadow-sm"
                >
                  <Plus size={14} /> Create project
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {projects.map((p, idx) => {
                  const fallbackColors = ["#ec4899", "#6d5dfb", "#3b82f6", "#f97316", "#10b981"];
                  const color = p.color || fallbackColors[idx % fallbackColors.length];

                  return (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/workspace/${workspace.slug}/projects/${p.id}`)}
                      className="group relative cursor-pointer flex flex-col justify-between rounded-[28px] bg-white p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {/* Colored Vertical Pill Indicator */}
                            <div
                              className="h-10 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <div>
                              <h3 className="font-bold text-slate-900 group-hover:text-[#6d5dfb] transition-colors text-sm">
                                {p.name}
                              </h3>
                              <span className="text-[10px] font-semibold text-slate-400">
                                Active Recently
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-300 hover:text-slate-600 transition p-1"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        {p.description ? (
                          <p className="mt-4 line-clamp-2 text-xs font-medium text-slate-500 leading-relaxed pl-5">
                            {p.description}
                          </p>
                        ) : (
                          <p className="mt-4 text-xs italic text-slate-300 pl-5">
                            No description provided.
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                        <span className="group-hover:text-slate-800 transition flex items-center gap-1">
                          Open board <ArrowRight size={14} className="transition group-hover:translate-x-1 text-[#6d5dfb]" />
                        </span>

                        {/* Dummy Team Avatars Stack */}
                        <div className="flex -space-x-1.5 overflow-hidden">
                          <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-purple-100 text-[9px] font-extrabold text-purple-700 flex items-center justify-center">
                            P
                          </div>
                          <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-100 text-[9px] font-extrabold text-blue-700 flex items-center justify-center">
                            W
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT 4 COLUMNS: Total Project Widget */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[32px] bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full space-y-6">
              
              <div className="text-center">
                <h2 className="text-base font-extrabold text-slate-900">Total Project</h2>
                
                {/* Circle Progress Gauge Chart */}
                <div className="relative my-6 flex items-center justify-center">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#f1f5f9"
                      strokeWidth="6"
                      strokeDasharray="4 4"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#6d5dfb"
                      strokeWidth="6"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - (projects.length > 0 ? 0.75 : 0))}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="31"
                      stroke="#f97316"
                      strokeWidth="5"
                      strokeDasharray="194.7"
                      strokeDashoffset={194.7 * (1 - (projects.length > 0 ? 0.5 : 0))}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000"
                    />
                  </svg>
                </div>

                <div className="space-y-1">
                  <p className="text-2xl font-black text-slate-900">
                    {projects.length} Total
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    Projects in current workspace
                  </p>
                </div>
              </div>

              {/* Quick Project List Widget */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                {projects.slice(0, 5).map((proj, idx) => {
                  const fallbackColors = ["#3b82f6", "#ec4899", "#6d5dfb", "#f97316", "#10b981"];
                  const dotColor = proj.color || fallbackColors[idx % fallbackColors.length];

                  return (
                    <div
                      key={proj.id}
                      onClick={() => router.push(`/workspace/${workspace.slug}/projects/${proj.id}`)}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: dotColor }}
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-[#6d5dfb] transition-colors line-clamp-1">
                            {proj.name}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-400">
                            Active Board
                          </p>
                        </div>
                      </div>
                      <MoreVertical size={14} className="text-slate-300" />
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* CREATE PROJECT MODAL */}
      <AnimatePresence>
        {showCreate && (
          <CreateProjectModal onCreate={handleCreate} onClose={() => setShowCreate(false)} />
        )}
      </AnimatePresence>
    </div>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md rounded-[32px] border border-slate-100 bg-white p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Create New Project</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Organize your tasks and board workflow
            </p>
          </div>
          <button onClick={onClose} className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">Project name</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Graphic Design"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-800 outline-none transition focus:border-[#6d5dfb] focus:bg-white focus:ring-2 focus:ring-[#6d5dfb]/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">Description (optional)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of project goals..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs font-medium text-slate-800 outline-none transition focus:border-[#6d5dfb] focus:bg-white focus:ring-2 focus:ring-[#6d5dfb]/20"
            />
          </label>

          {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={!name.trim() || creating}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#6d5dfb] text-xs font-bold text-white shadow-md shadow-[#6d5dfb]/20 transition hover:bg-[#5b4be3] disabled:opacity-40"
            >
              {creating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}