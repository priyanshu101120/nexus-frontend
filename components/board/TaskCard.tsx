"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/hooks/type";
import { MoreVertical, Paperclip } from "lucide-react";

// Image ke tarah priority ke according soft pastel card themes
const CARD_THEMES: Record<string, { bg: string; text: string; subText: string }> = {
  HIGH: {
    bg: "bg-[#fee895]", // Soft Warm Yellow
    text: "text-[#2e2600]",
    subText: "text-black/60",
  },
  MEDIUM: {
    bg: "bg-[#c7ddff]", // Soft Pastel Blue
    text: "text-[#0f2942]",
    subText: "text-[#1e3a8a]/70",
  },
  LOW: {
    bg: "bg-[#ece8df]", // Warm Cream Neutral
    text: "text-[#292723]",
    subText: "text-black/60",
  },
};

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const theme = CARD_THEMES[task.priority] || CARD_THEMES.LOW;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`group relative mb-3 cursor-grab rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing ${theme.bg}`}
    >
      {/* Top Bar: Category / Priority Tag & Menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-black/5 text-[10px]">
            📌
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.subText}`}>
            {task.priority} Priority
          </span>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          className="rounded-full p-1 text-black/30 hover:bg-black/5 hover:text-black transition"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Task Title */}
      <h3 className={`mt-2 text-sm font-bold leading-snug tracking-tight ${theme.text}`}>
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className={`mt-1.5 line-clamp-2 text-xs leading-relaxed ${theme.subText}`}>
          {task.description}
        </p>
      )}

      {/* Due Date Chip (Image ke Agenda chip jaise) */}
      {task.dueDate && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-black/5 px-2 py-1 text-[10px] font-medium text-black/70">
          <Paperclip size={11} />
          <span>{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
      )}

      {/* Footer: Assignees Stack & Action Pill */}
      <div className="mt-4 flex items-center justify-between pt-1">
        {/* User Avatars Stack */}
        <div className="flex -space-x-1.5 overflow-hidden">
          {task.assignee ? (
            <div
              title={task.assignee.name}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18181b] text-[9px] font-bold text-white ring-2 ring-white"
            >
              {task.assignee.name.slice(0, 2).toUpperCase()}
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-[9px] font-medium text-black/40 ring-2 ring-white">
              --
            </div>
          )}
        </div>

        {/* Action Button Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="rounded-full bg-black/80 px-3 py-1 text-[10px] font-semibold text-white shadow-sm transition hover:bg-black"
        >
          Open
        </button>
      </div>
    </div>
  );
}