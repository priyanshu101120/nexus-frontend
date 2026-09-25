"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowUpRight,
  Users,
  Kanban,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  ListTodo,
  Activity,
  Shield,
  User,
} from "lucide-react";
import { useProjectContext } from "@/context/ProjectContext";
import { useWorkspaceContext } from "@/context/WorkspaceContext";

export default function ProjectDetail() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { project, taskCounts, progressPercent } = useProjectContext();
  const { members } = useWorkspaceContext();
  const [activeTab, setActiveTab] = useState<"Overview" | "Board" | "Tasks" | "Activity">("Overview");

  if (!project) return null;

  const goToBoard = () => router.push(`/workspace/${slug}/projects/${project.id}/board`);

  const columns = project.board?.columns ?? [];

  return (
    <div className="-m-6 min-h-screen bg-[#f4f5f9] p-6 lg:p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* BREADCRUMB & HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {/* Breadcrumb Pills */}
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-400">
              <button
                onClick={() => router.push(`/workspace/${slug}/projects`)}
                className="transition hover:text-[#6d5dfb]"
              >
                Projects
              </button>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-slate-800 font-extrabold">{project.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full shadow-sm shrink-0"
                style={{ background: project.color || "#6d5dfb" }}
              />
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
                {project.name}
              </h1>
            </div>

            {project.description && (
              <p className="mt-1 text-xs font-medium text-slate-400 max-w-2xl">
                {project.description}
              </p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {}}
              className="flex h-10 items-center gap-2 rounded-2xl bg-white px-4 text-xs font-bold text-slate-700 shadow-sm border border-slate-100 transition hover:bg-slate-50"
            >
              <Users size={16} className="text-[#6d5dfb]" />
              <span>{members.length} Members</span>
            </button>

            <button
              onClick={goToBoard}
              className="flex h-10 items-center gap-2 rounded-2xl bg-[#6d5dfb] px-4 text-xs font-bold text-white shadow-md shadow-[#6d5dfb]/20 transition hover:bg-[#5b4be3]"
            >
              <span>Open Board</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* TOP HERO STATS CARD */}
        <div className="rounded-[32px] bg-white p-6 lg:p-8 shadow-sm border border-slate-100">
          <div className="grid gap-6 md:grid-cols-12 items-center">
            
            {/* Left: Overall Progress Gauge */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6d5dfb]">
                    PROJECT PROGRESS
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5">
                    {progressPercent}% Completed
                  </h2>
                </div>

                <span className="rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-extrabold text-[#6d5dfb]">
                  {taskCounts.done} / {taskCounts.total} Tasks Done
                </span>
              </div>

              {/* Progress Bar with Gradient Accent */}
              <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6d5dfb] to-[#9b8eff] transition-all duration-700 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Mini Status Breakdown */}
              <div className="flex flex-wrap gap-6 pt-1 text-xs font-bold">
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                  <span>{taskCounts.done} Completed</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={15} className="text-amber-500" />
                  <span>{taskCounts.total - taskCounts.done} Remaining</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Layers size={15} className="text-[#6d5dfb]" />
                  <span>{columns.length} Board Columns</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Banner */}
            <div className="md:col-span-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/60 p-5 border border-purple-100/60 text-center space-y-2">
              <Sparkles className="mx-auto text-[#6d5dfb]" size={22} />
              <h3 className="text-xs font-extrabold text-slate-900">Sprint Health Active</h3>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                Task completion is on track for this workspace milestone.
              </p>
            </div>

          </div>
        </div>

        {/* MAIN CONTENT GRID (Tabs Content + Team Sidebar) */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* LEFT 8 COLUMNS: Tab Navigation & Board Overview */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="rounded-[32px] bg-white p-6 shadow-sm border border-slate-100 space-y-6">
              
              {/* Navigation Tabs Bar */}
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-4 overflow-x-auto">
                {[
                  { name: "Overview", icon: LayoutGrid },
                  { name: "Board", icon: Kanban },
                  { name: "Tasks", icon: ListTodo },
                  { name: "Activity", icon: Activity },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      onClick={() => {
                        if (tab.name === "Board") {
                          goToBoard();
                        } else {
                          setActiveTab(tab.name as any);
                        }
                      }}
                      className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition ${
                        isActive
                          ? "bg-[#6d5dfb] text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={15} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Board Columns Summary List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">Board Columns</h3>
                  <button
                    onClick={goToBoard}
                    className="text-xs font-bold text-[#6d5dfb] hover:underline"
                  >
                    Manage Board →
                  </button>
                </div>

                <div className="space-y-3">
                  {columns.map((col) => {
                    const isDone = col.name.trim().toUpperCase() === "DONE";
                    return (
                      <div
                        key={col.id}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100/80 transition hover:bg-slate-100/50"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-3 w-3 rounded-full ${
                              isDone ? "bg-emerald-500" : "bg-[#6d5dfb]"
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-800">{col.name}</span>
                        </div>

                        <span className="rounded-xl bg-white px-3 py-1 text-[11px] font-extrabold text-slate-600 shadow-sm border border-slate-100">
                          {col.tasks.length} {col.tasks.length === 1 ? "task" : "tasks"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Team Members Widget */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[32px] bg-white p-6 shadow-sm border border-slate-100 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">Project Team</h3>
                <span className="rounded-xl bg-purple-50 px-2.5 py-1 text-[10px] font-extrabold text-[#6d5dfb]">
                  {members.length} Active
                </span>
              </div>

              <div className="space-y-3.5">
                {members.map((m) => {
                  const initials = m.user.name.slice(0, 2).toUpperCase();
                  const isOwner = m.role === "OWNER";
                  const isAdmin = m.role === "ADMIN";

                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 border border-slate-100/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-[#6d5dfb] to-[#9b8eff] text-xs font-black text-white shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{m.user.name}</p>
                          <p className="text-[10px] font-medium text-slate-400">{m.user.email}</p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-xl px-2 py-0.5 text-[9px] font-extrabold ${
                          isOwner
                            ? "bg-amber-50 text-amber-600"
                            : isAdmin
                            ? "bg-purple-50 text-purple-600"
                            : "bg-slate-200/60 text-slate-600"
                        }`}
                      >
                        {isOwner ? <Shield size={10} /> : <User size={10} />}
                        {m.role}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}