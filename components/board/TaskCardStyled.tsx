"use client";

import { motion } from "motion/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { Task } from "@/hooks/type";
import { Avatar, Badge } from "@/components/ui";

function formatDueDate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="mb-2 cursor-grab rounded-2xl border border-black/[.07] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-nexus/30 hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-5">{task.title}</h3>
        <MoreHorizontal size={16} className="shrink-0 text-[#aaa]" />
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-2 text-xs text-[#888]">{task.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge
          tone={task.priority === "HIGH" ? "red" : task.priority === "MEDIUM" ? "yellow" : "green"}
        >
          {task.priority}
        </Badge>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.assignee && <Avatar name={task.assignee.name} size="sm" />}
          {task.dueDate && (
            <span className="text-[10px] text-[#777]">{formatDueDate(task.dueDate)}</span>
          )}
        </div>
        {/* Comment count omitted here — would require an N+1 fetch per card.
            Full comment thread loads when the detail drawer opens instead. */}
        <MessageCircle size={12} className="text-[#bbb]" />
      </div>
    </motion.div>
  );
}