"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Send, Loader2, X } from "lucide-react";
import { Task, Column as ColumnType, TaskPriority, MemberWithUser } from "@/hooks/type";
import { TaskCard } from "./TaskCard";

const PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

export function BoardColumn({
  column,
  tasks,
  members,
  onTaskClick,
  onAddTask,
}: {
  column: ColumnType;
  tasks: Task[];
  members: MemberWithUser[];
  onTaskClick: (task: Task) => void;
  onAddTask: (title: string, priority: TaskPriority, assigneeId?: string) => Promise<void>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: "column" } });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const closeForm = () => {
    setAdding(false);
    setTitle("");
    setPriority("MEDIUM");
    setAssigneeId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    try {
      setSubmitting(true);
      await onAddTask(title.trim(), priority, assigneeId || undefined);
      closeForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-[280px] flex-1 flex-col rounded-3xl bg-[#f2eee5]/70 p-2.5 transition-all duration-200 ${
        isOver ? "ring-2 ring-black/20" : ""
      }`}
    >
      {/* Column Header */}
      <div className="mb-3 flex items-center justify-between px-3 pt-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-black/70">
            {column.name}
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px] font-bold text-black/60">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => setAdding(true)}
          className="rounded-full p-1 text-black/40 hover:bg-black/5 hover:text-black transition"
          title="Add task"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Task Cards Container */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-[80px] flex-1">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </div>
      </SortableContext>

      {/* New Task Input Form */}
      {adding ? (
        <form onSubmit={handleSubmit} className="mt-2 space-y-2 rounded-2xl bg-white/90 p-3 shadow-sm backdrop-blur-sm">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            disabled={submitting}
            className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-xs outline-none focus:border-black disabled:opacity-60"
          />

          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            disabled={submitting}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs outline-none focus:border-black disabled:opacity-60"
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.user.id} value={m.user.id}>
                {m.user.name}
              </option>
            ))}
          </select>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex gap-1">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={submitting}
                  onClick={() => setPriority(p)}
                  className={`rounded-full px-2.5 py-1 text-[9px] font-bold transition ${
                    priority === p
                      ? "bg-black text-white"
                      : "bg-black/5 text-black/50 hover:bg-black/10"
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
                className="grid h-7 w-7 place-items-center rounded-full text-black/50 hover:bg-black/5"
              >
                <X size={14} />
              </button>

              <button
                type="submit"
                disabled={!title.trim() || submitting}
                className="grid h-7 w-7 place-items-center rounded-full bg-black text-white hover:bg-black/80 disabled:opacity-40"
              >
                {submitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={12} />}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-black/15 py-2.5 text-xs font-semibold text-black/50 transition hover:border-black/30 hover:bg-black/5 hover:text-black"
        >
          <Plus size={14} /> Add Task
        </button>
      )}
    </div>
  );
}