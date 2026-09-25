"use client";

import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Users,
  ListTodo,
  ArrowUpRight,
  Sparkles,
  Plus,
} from "lucide-react";

import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/Authcontext";
import useProjectsOverview from "@/hooks/useProjectOverview";
import { Progress } from "@/components/ui/Progress";
import { Avatar } from "@/components/ui";

export default function WorkspaceOverviewPage() {
  const router = useRouter();
  const { workspace, members } = useWorkspaceContext();
  const { user } = useAuth();
  const { projects, loading } = useProjectsOverview();

  if (!workspace) return null;

  const totalTasks = projects.reduce((sum, p) => sum + p.total, 0);
  const doneTasks = projects.reduce((sum, p) => sum + p.done, 0);
  const overallProgress =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const userName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="-m-6 min-h-screen bg-[#f4f5f9] p-6 lg:p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d5dfb]">
            Workspace
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Good to see you, {userName}.
          </h1>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {workspace.name} · /{workspace.slug}
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={FolderKanban}
            label="Projects"
            value={projects.length}
          />
          <StatCard icon={Users} label="Members" value={members.length} />
          <StatCard icon={ListTodo} label="Tasks" value={totalTasks} />
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT: Project progress cards */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900">
                Project progress
              </h2>
              <button
                onClick={() => router.push(`/workspace/${workspace.slug}/projects`)}
                className="text-xs font-bold text-[#6d5dfb] hover:underline"
              >
                View all →
              </button>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-40 animate-pulse rounded-[28px] border border-slate-100 bg-white"
                  />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#6d5dfb]">
                  <Sparkles size={24} />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">
                  No projects yet
                </h3>
                <p className="mx-auto mt-1 max-w-sm text-xs font-medium text-slate-400">
                  Create your first project to see progress here.
                </p>
                <button
                  onClick={() => router.push(`/workspace/${workspace.slug}/projects`)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6d5dfb] px-4 py-2 text-xs font-bold text-white shadow-sm"
                >
                  <Plus size={14} /> Create project
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {projects.map((p, idx) => {
                  const fallbackColors = ["#ec4899", "#6d5dfb", "#3b82f6", "#f97316", "#10b981"];
                  const color = p.color || fallbackColors[idx % fallbackColors.length];

                  return (
                    <div
                      key={p.id}
                      onClick={() =>
                        router.push(`/workspace/${workspace.slug}/projects/${p.id}`)
                      }
                      className="group cursor-pointer rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white shadow-sm"
                            style={{ backgroundColor: color }}
                          >
                            <FolderKanban size={18} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-[#6d5dfb] transition">
                              {p.name}
                            </h3>
                            <p className="text-[11px] font-semibold text-slate-400">
                              {p.total} {p.total === 1 ? "task" : "tasks"}
                            </p>
                          </div>
                        </div>

                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-slate-300 transition group-hover:text-[#6d5dfb]"
                        />
                      </div>

                      <div className="mt-5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-400">Completed</span>
                          <span className="text-slate-800">{p.progress}%</span>
                        </div>
                        <Progress value={p.progress} />
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400">
                          {p.done}/{p.total} done
                        </span>
                        <div className="flex -space-x-1.5">
                          {members.slice(0, 3).map((m) => (
                            <div key={m.id} className="ring-2 ring-white rounded-full">
                              <Avatar name={m.user.name} size="sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Overall progress gauge widget */}
          <div className="lg:col-span-4">
            <div className="rounded-[32px] bg-white p-6 shadow-sm border border-slate-100 space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Workspace completion
                </span>

                <div className="relative my-6 flex items-center justify-center">
                  <svg className="h-36 w-36 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="7" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#6d5dfb"
                      strokeWidth="7"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - overallProgress / 100)}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900">
                      {overallProgress}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Complete</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100/60">
                  <p className="text-[10px] font-bold text-slate-400">DONE</p>
                  <p className="mt-1 text-lg font-black text-slate-800">{doneTasks}</p>
                </div>
                <div className="rounded-2xl bg-purple-50/50 p-3 border border-purple-100/50">
                  <p className="text-[10px] font-bold text-purple-600">REMAINING</p>
                  <p className="mt-1 text-lg font-black text-[#6d5dfb]">
                    {totalTasks - doneTasks}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#6d5dfb]/10 text-[#6d5dfb]">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400">{label}</p>
          <p className="text-2xl font-black text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}