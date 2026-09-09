"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Send, Loader2, X } from "lucide-react";
import { Task, Column as ColumnType, TaskPriority } from "@/hooks/type";
import { TaskCard } from "./TaskCard";

const PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

const PRIORITY_PILL_ACTIVE: Record<TaskPriority, string> = {
  LOW: "border-green-300 bg-green-50 text-green-600",
  MEDIUM: "border-amber-300 bg-amber-50 text-amber-600",
  HIGH: "border-red-300 bg-red-50 text-red-600",
};

export function BoardColumn({
  column,
  tasks,
  onTaskClick,
  onAddTask,
}: {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (title: string, priority: TaskPriority) => Promise<void>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: "column" } });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [submitting, setSubmitting] = useState(false);

  const closeForm = () => {
    setAdding(false);
    setTitle("");
    setPriority("MEDIUM");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    try {
      setSubmitting(true);
      await onAddTask(title.trim(), priority);
      closeForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-[280px] flex-1 flex-col rounded-2xl border border-black/[0.05] bg-[#f7f7f4] p-2 transition ${
        isOver ? "ring-2 ring-[#6d5dfb]/40" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between px-2 pt-1">
        <span className="text-[11px] font-bold tracking-widest text-black/45">{column.name}</span>
        <span className="text-[11px] text-black/30">{tasks.length}</span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-[40px] flex-1">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </div>
      </SortableContext>

      {adding ? (
        <form onSubmit={handleSubmit} className="mt-1 space-y-2 rounded-xl bg-white p-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            disabled={submitting}
            className="w-full rounded-lg border border-black/10 px-2.5 py-2 text-xs outline-none focus:border-[#6d5dfb]/40 disabled:opacity-60"
          />

          <div className="flex items-center justify-between gap-3">
            {/* Priority pills — same idea as an effort selector: pick one before sending */}
            <div className="flex gap-1">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={submitting}
                  onClick={() => setPriority(p)}
                  className={`rounded-full border px-2 py-1 text-[10px] font-bold transition ${
                    priority === p
                      ? PRIORITY_PILL_ACTIVE[p]
                      : "border-black/10 text-black/35 hover:border-black/20"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="grid h-7 w-7 place-items-center rounded-lg text-black/40 transition hover:bg-black/[0.04] hover:text-black disabled:opacity-40"
                title="Cancel"
              >
                <X size={14} />
              </button>

              <button
                type="submit"
                disabled={!title.trim() || submitting}
                className="grid h-7 w-7 place-items-center rounded-lg bg-[#111] text-white transition hover:bg-black disabled:opacity-40"
                title="Add task"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-1 flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-black/40 transition hover:bg-black/[0.03] hover:text-black"
        >
          <Plus size={14} /> Add task
        </button>
      )}
    </div>
  );
}