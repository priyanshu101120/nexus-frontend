"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/hooks/type";

const PRIORITY_STYLES: Record<string, string> = {
  HIGH: "bg-red-50 text-red-600",
  MEDIUM: "bg-amber-50 text-amber-600",
  LOW: "bg-green-50 text-green-600",
};

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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="mb-2 cursor-grab rounded-xl border border-black/[0.06] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
    >
      <p className="text-sm font-semibold">{task.title}</p>

      <div className="mt-3 flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>

        {task.assignee && (
          <div className="grid h-6 w-6 place-items-center rounded-full bg-[#6d5dfb] text-[9px] font-bold text-white">
            {task.assignee.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}