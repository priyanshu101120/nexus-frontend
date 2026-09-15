"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Search, Filter, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui";
import { useProjectContext } from "@/context/ProjectContext";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { taskApi } from "@/lib/api";
import { Task, TaskPriority } from "@/hooks/type";
import { BoardColumn } from "@/components/board/BoardColumn";
import { TaskCard } from "@/components/board/TaskCard";
import { TaskDetailDrawer } from "@/components/board/Taskdetaildrawer";

type ColumnMap = Record<string, Task[]>;

export default function BoardPage() {
  const params = useParams();
  const slug = params.slug as string;
  const projectId = params.projectId as string;

  const { project, refresh } = useProjectContext();
  const { members } = useWorkspaceContext();
  const [columns, setColumns] = useState<ColumnMap>({});
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (!project?.board) return;
    const map: ColumnMap = {};
    for (const col of project.board.columns) {
      map[col.id] = [...col.tasks].sort((a, b) => a.order - b.order);
    }
    setColumns(map);
  }, [project]);

  // Client-side search + priority filter over the currently loaded board —
  // there's no backend search endpoint yet (that's a Phase 3 item).
  const visibleColumns = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered: ColumnMap = {};
    for (const colId of Object.keys(columns)) {
      filtered[colId] = columns[colId].filter((t) => {
        const matchesSearch = !q || t.title.toLowerCase().includes(q);
        const matchesPriority = !highPriorityOnly || t.priority === "HIGH";
        return matchesSearch && matchesPriority;
      });
    }
    return filtered;
  }, [columns, search, highPriorityOnly]);

  if (!project?.board) return null;

  const openTask = openTaskId
    ? Object.values(columns).flat().find((t) => t.id === openTaskId) ?? null
    : null;
  const openTaskColumnName = openTask
    ? project.board.columns.find((c) => c.id === openTask.columnId)?.name ?? ""
    : "";

  function findColumnIdForTask(taskId: string) {
    return Object.keys(columns).find((colId) => columns[colId].some((t) => t.id === taskId));
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string;
    const colId = findColumnIdForTask(taskId);
    if (colId) setActiveTask(columns[colId].find((t) => t.id === taskId) ?? null);
  }

  function handleDragOver(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeColId = findColumnIdForTask(activeId);
    const overColId = columns[overId] ? overId : findColumnIdForTask(overId);
    if (!activeColId || !overColId || activeColId === overColId) return;

    setColumns((prev) => {
      const activeItems = [...prev[activeColId]];
      const overItems = [...prev[overColId]];
      const activeIndex = activeItems.findIndex((t) => t.id === activeId);
      const [moved] = activeItems.splice(activeIndex, 1);
      const overIndex = overItems.findIndex((t) => t.id === overId);
      overItems.splice(overIndex >= 0 ? overIndex : overItems.length, 0, moved);
      return { ...prev, [activeColId]: activeItems, [overColId]: overItems };
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeColId = findColumnIdForTask(activeId);
    if (!activeColId) return;
    const overColId = columns[overId] ? overId : findColumnIdForTask(overId) ?? activeColId;

    let finalOrder = 0;
    setColumns((prev) => {
      const items = [...prev[overColId]];
      const oldIndex = items.findIndex((t) => t.id === activeId);
      const newIndex = items.findIndex((t) => t.id === overId);
      const reordered =
        oldIndex >= 0 && newIndex >= 0 ? arrayMove(items, oldIndex, newIndex) : items;
      finalOrder = reordered.findIndex((t) => t.id === activeId);
      return { ...prev, [overColId]: reordered };
    });

    try {
      await taskApi.move(slug, projectId, activeId, { columnId: overColId, order: finalOrder });
    } catch {
      await refresh();
    }
  }

  async function handleAddTask(columnId: string, title: string, priority: TaskPriority, assigneeId?: string) {
    const res = await taskApi.create(slug, projectId, columnId, { title, priority, assigneeId });
    setColumns((prev) => ({ ...prev, [columnId]: [...prev[columnId], res.task] }));
  }

  function handleTaskDeleted(taskId: string) {
    setColumns((prev) => {
      const next: ColumnMap = {};
      for (const colId of Object.keys(prev)) {
        next[colId] = prev[colId].filter((t) => t.id !== taskId);
      }
      return next;
    });
  }

  return (
    <>
      <PageHeader
        title={project.name}
        description="A focused board for moving the next important work forward."
      >
        <div className="flex gap-2">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="h-9 rounded-xl border border-black/[0.08] bg-white pl-8 pr-3 text-xs outline-none focus:border-nexus/40"
            />
          </div>
          <Button variant="secondary" onClick={() => setHighPriorityOnly((v) => !v)}>
            <Filter size={15} />
            {highPriorityOnly ? "High priority" : "Filter"}
          </Button>
        </div>
      </PageHeader>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-5 overflow-x-auto pb-4 md:grid-cols-4">
          {project.board.columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={visibleColumns[col.id] ?? []}
              members={members}
              onTaskClick={(task) => setOpenTaskId(task.id)}
              onAddTask={(title, priority, assigneeId) => handleAddTask(col.id, title, priority, assigneeId)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} onClick={() => {}} />}
        </DragOverlay>
      </DndContext>

      {openTask && (
        <TaskDetailDrawer
          task={openTask}
          columnName={openTaskColumnName}
          slug={slug}
          projectId={projectId}
          onClose={() => setOpenTaskId(null)}
          onDeleted={handleTaskDeleted}
        />
      )}
    </>
  );
}