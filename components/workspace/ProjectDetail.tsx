"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Circle,
  Clock3,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  UserPlus,
  Users,
  X,
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  assignee: string;
  initials: string;
  due?: string;
  labels: string[];
};

type Column = {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
};

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To do",
    color: "bg-slate-400",
    tasks: [
      {
        id: "1",
        title: "Design landing page",
        description: "Create the initial landing page layout.",
        priority: "High",
        assignee: "Priyanshu",
        initials: "P",
        due: "Today",
        labels: ["Design"],
      },
      {
        id: "2",
        title: "Define project structure",
        description: "Set up the base architecture for the project.",
        priority: "Medium",
        assignee: "Rahul",
        initials: "R",
        labels: ["Planning"],
      },
      {
        id: "3",
        title: "Prepare content",
        priority: "Low",
        assignee: "Ananya",
        initials: "A",
        due: "Aug 29",
        labels: ["Content"],
      },
    ],
  },
  {
    id: "progress",
    title: "In progress",
    color: "bg-violet-500",
    tasks: [
      {
        id: "4",
        title: "Build dashboard UI",
        description: "Implement workspace dashboard screens.",
        priority: "High",
        assignee: "Priyanshu",
        initials: "P",
        due: "Aug 27",
        labels: ["Frontend", "UI"],
      },
      {
        id: "5",
        title: "Create authentication flow",
        priority: "Medium",
        assignee: "Aman",
        initials: "A",
        labels: ["Auth"],
      },
    ],
  },
  {
    id: "review",
    title: "In review",
    color: "bg-amber-400",
    tasks: [
      {
        id: "6",
        title: "Workspace navigation",
        description: "Review sidebar and workspace navigation.",
        priority: "Medium",
        assignee: "Rahul",
        initials: "R",
        due: "Tomorrow",
        labels: ["Review"],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "bg-emerald-500",
    tasks: [
      {
        id: "7",
        title: "Project setup",
        priority: "Low",
        assignee: "Priyanshu",
        initials: "P",
        labels: ["Setup"],
      },
      {
        id: "8",
        title: "Database schema",
        priority: "High",
        assignee: "Aman",
        initials: "A",
        labels: ["Backend"],
      },
    ],
  },
];

const priorityStyles = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-600",
};

export function ProjectDetail({ projectId }: { projectId: string }) {
  const [columns, setColumns] = useState(initialColumns);
  const [view, setView] = useState<"board" | "list">("board");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "High" | "Medium" | "Low"
  >("all");
  const [showTaskModal, setShowTaskModal] = useState(false);

  const filteredColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description?.toLowerCase().includes(search.toLowerCase());

        const matchesPriority =
          activeFilter === "all" || task.priority === activeFilter;

        return matchesSearch && matchesPriority;
      }),
    }));
  }, [columns, search, activeFilter]);

  const totalTasks = columns.reduce(
    (total, column) => total + column.tasks.length,
    0,
  );

  const completedTasks =
    columns.find((column) => column.id === "done")?.tasks.length ?? 0;

  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] pb-10">
      {/* Project header */}
      <div className="mb-6">
        <button
          className="mb-5 inline-flex items-center gap-2 text-sm text-black/45 transition hover:text-black"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={16} />
          Back to projects
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-black/40">
              <span>Projects</span>
              <span>/</span>
              <span className="text-black/70">Nexus Platform</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/15" />

              <div>
                <h1 className="text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                  Nexus Platform
                </h1>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-black/45">
                  Build and ship the next generation workspace experience.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium transition hover:bg-black/[0.03]">
              <Users size={16} />
              <span className="hidden sm:inline">Members</span>
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px]">
                8
              </span>
            </button>

            <button
              onClick={() => setShowTaskModal(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#111] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black/80"
            >
              <Plus size={16} />
              Add task
            </button>

            <button className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white transition hover:bg-black/[0.03]">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Project stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total tasks"
          value={totalTasks}
          icon={<Check size={16} />}
        />

        <StatCard
          label="Completed"
          value={completedTasks}
          icon={<Check size={16} />}
        />

        <StatCard
          label="In progress"
          value={
            columns.find((column) => column.id === "progress")?.tasks.length ??
            0
          }
          icon={<Clock3 size={16} />}
        />

        <div className="rounded-2xl border border-black/[0.06] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-black/40">Progress</span>
            <span className="text-sm font-bold">{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3">
            <Search size={16} className="text-black/35" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-40 bg-transparent text-sm outline-none placeholder:text-black/30"
            />
          </div>

          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) =>
                setActiveFilter(
                  e.target.value as "all" | "High" | "Medium" | "Low",
                )
              }
              className="h-10 appearance-none rounded-xl border border-black/[0.08] bg-white py-0 pl-9 pr-9 text-sm outline-none"
            >
              <option value="all">All priorities</option>
              <option value="High">High priority</option>
              <option value="Medium">Medium priority</option>
              <option value="Low">Low priority</option>
            </select>

            <Filter
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
            />

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40"
            />
          </div>

          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-black/60 transition hover:bg-black/[0.03]">
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        <div className="flex items-center self-start rounded-xl border border-black/[0.08] bg-white p-1">
          <button
            onClick={() => setView("board")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              view === "board"
                ? "bg-black text-white"
                : "text-black/45 hover:text-black"
            }`}
          >
            Board
          </button>

          <button
            onClick={() => setView("list")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              view === "list"
                ? "bg-black text-white"
                : "text-black/45 hover:text-black"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Board */}
      <AnimatePresence mode="wait">
        {view === "board" ? (
          <motion.div
            key="board"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="overflow-x-auto pb-4"
          >
            <div className="grid min-w-[1100px] grid-cols-4 gap-4">
              {filteredColumns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  onAdd={() => setShowTaskModal(true)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <TaskList columns={filteredColumns} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task modal */}
      <AnimatePresence>
        {showTaskModal && (
          <TaskModal onClose={() => setShowTaskModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                      */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-4">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/[0.04] text-black/55">
        {icon}
      </div>

      <p className="text-xs text-black/40">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Kanban                                                                     */
/* -------------------------------------------------------------------------- */

function KanbanColumn({
  column,
  onAdd,
}: {
  column: Column;
  onAdd: () => void;
}) {
  return (
    <div className="min-h-[560px] rounded-2xl border border-black/[0.06] bg-black/[0.025] p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />

          <h2 className="text-sm font-semibold">{column.title}</h2>

          <span className="rounded-md bg-black/[0.06] px-1.5 py-0.5 text-[10px] font-semibold text-black/45">
            {column.tasks.length}
          </span>
        </div>

        <button className="grid h-7 w-7 place-items-center rounded-lg text-black/35 transition hover:bg-black/5 hover:text-black">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="space-y-2.5">
        {column.tasks.map((task, index) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </div>

      <button
        onClick={onAdd}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/10 py-2.5 text-xs font-medium text-black/35 transition hover:border-black/20 hover:bg-white hover:text-black/60"
      >
        <Plus size={14} />
        Add task
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Task Card                                                                  */
/* -------------------------------------------------------------------------- */

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="group rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition hover:-translate-y-0.5 hover:border-black/[0.12] hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <Circle size={15} className="mt-0.5 shrink-0 text-black/20" />

          <h3 className="text-sm font-semibold leading-5">
            {task.title}
          </h3>
        </div>

        <button className="shrink-0 opacity-0 transition group-hover:opacity-100">
          <MoreHorizontal size={15} className="text-black/40" />
        </button>
      </div>

      {task.description && (
        <p className="mb-3 line-clamp-2 pl-[23px] text-xs leading-5 text-black/40">
          {task.description}
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-1.5 pl-[23px]">
        {task.labels.map((label) => (
          <span
            key={label}
            className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-600"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-black/[0.05] pt-3">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-[9px] font-bold text-white">
            {task.initials}
          </div>

          {task.due && (
            <span className="flex items-center gap-1 text-[10px] text-black/35">
              <CalendarDays size={11} />
              {task.due}
            </span>
          )}
        </div>

        <span
          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* List View                                                                  */
/* -------------------------------------------------------------------------- */

function TaskList({ columns }: { columns: Column[] }) {
  const tasks = columns.flatMap((column) =>
    column.tasks.map((task) => ({
      ...task,
      column: column.title,
      columnColor: column.color,
    })),
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-black/[0.06] bg-black/[0.015] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-black/35">
        <span>Task</span>
        <span>Status</span>
        <span>Assignee</span>
        <span>Priority</span>
      </div>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center border-b border-black/[0.05] px-5 py-4 last:border-0"
        >
          <div>
            <p className="text-sm font-semibold">{task.title}</p>
            {task.description && (
              <p className="mt-1 text-xs text-black/35">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-black/55">
            <span
              className={`h-2 w-2 rounded-full ${task.columnColor}`}
            />
            {task.column}
          </div>

          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-600">
              {task.initials}
            </div>
            <span className="text-xs">{task.assignee}</span>
          </div>

          <span
            className={`w-fit rounded-md px-2 py-1 text-[10px] font-semibold ${priorityStyles[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Add Task Modal                                                             */
/* -------------------------------------------------------------------------- */

function TaskModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
              New task
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Create a task
            </h2>
          </div>

          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-black/[0.04] text-black/50 transition hover:bg-black/[0.08]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-black/60">
              Task name
            </label>

            <input
              placeholder="e.g. Design onboarding screen"
              className="h-11 w-full rounded-xl border border-black/10 bg-black/[0.015] px-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-black/60">
              Description
            </label>

            <textarea
              placeholder="Add some context..."
              rows={4}
              className="w-full resize-none rounded-xl border border-black/10 bg-black/[0.015] p-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-black/60">
                Priority
              </label>

              <select className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none">
                <option>Medium</option>
                <option>Low</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-black/60">
                Assignee
              </label>

              <select className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none">
                <option>Priyanshu</option>
                <option>Rahul</option>
                <option>Aman</option>
                <option>Ananya</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm font-medium text-black/55 hover:bg-black/[0.04]"
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            className="h-10 rounded-xl bg-[#111] px-5 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Create task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}