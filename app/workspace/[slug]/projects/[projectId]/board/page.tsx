"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
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
import { Search, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui";
import { useProjectContext } from "@/context/ProjectContext";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { taskApi } from "@/lib/api";
import { Task, TaskPriority } from "@/hooks/type";
import { BoardColumn } from "@/components/board/BoardColumn";
import { TaskCard } from "@/components/board/TaskCard";
import { TaskDetailDrawer } from "@/components/board/Taskdetaildrawer";

import { getAccessToken} from "@/lib/api";

type ColumnMap = Record<string, Task[]>;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
  "http://localhost:5000";

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
  const socketRef = useRef<Socket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function withoutTask(cols: ColumnMap, taskId: string): ColumnMap {
    const next: ColumnMap = {};
    for (const id of Object.keys(cols)) {
      next[id] = cols[id].filter((t) => t.id !== taskId);
    }
    return next;
  }
  useEffect(() => {
    if (!project?.board) return;
    const map: ColumnMap = {};
    for (const col of project.board.columns) {
      map[col.id] = [...col.tasks].sort((a, b) => a.order - b.order);
    }
    setColumns(map);
  }, [project]);

  // ── Real-time: connect once per project, join its room, listen for
  // changes made by OTHER members, merge them into local state. ──
 useEffect(() => {
  if (!projectId) return;

  const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    // function form re-reads the token on every reconnect
    auth: (cb) => cb({ token: getAccessToken() }),
  });
  socketRef.current = socket;

  socket.on("connect", () => socket.emit("join-project", projectId));
  socket.on("connect_error", (e) => console.error("Socket error:", e.message));

  socket.on("task:created", ({ task }: { task: Task }) => {
    setColumns((prev) => {
      if (!prev[task.columnId]) return prev;
      // creator receives their own event too, so dedupe
      if (Object.values(prev).flat().some((t) => t.id === task.id)) return prev;
      return { ...prev, [task.columnId]: [...prev[task.columnId], task] };
    });
  });

  socket.on("task:updated", ({ task }: { task: Task }) => {
    setColumns((prev) => {
      const next: ColumnMap = {};
      for (const id of Object.keys(prev)) {
        next[id] = prev[id].map((t) => (t.id === task.id ? { ...t, ...task } : t));
      }
      return next;
    });
  });

  socket.on("task:moved", ({ task }: { task: Task }) => {
    setColumns((prev) => {
      if (!prev[task.columnId]) return prev;
      const next = withoutTask(prev, task.id);
      const target = [...next[task.columnId]];
      target.splice(Math.min(task.order, target.length), 0, task);
      next[task.columnId] = target;
      return next;
    });
  });

  socket.on("task:deleted", ({ taskId }: { taskId: string }) => {
    setColumns((prev) => withoutTask(prev, taskId));
    setOpenTaskId((id) => (id === taskId ? null : id));
  });

  return () => {
    socket.emit("leave-project", projectId);
    socket.disconnect();
    socketRef.current = null;
  };
}, [projectId]);

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
    ? (Object.values(columns)
        .flat()
        .find((t) => t.id === openTaskId) ?? null)
    : null;
  const openTaskColumnName = openTask
    ? (project.board.columns.find((c) => c.id === openTask.columnId)?.name ??
      "")
    : "";

  function findColumnIdForTask(taskId: string) {
    return Object.keys(columns).find((colId) =>
      columns[colId].some((t) => t.id === taskId),
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string;
    const colId = findColumnIdForTask(taskId);
    if (colId)
      setActiveTask(columns[colId].find((t) => t.id === taskId) ?? null);
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
    const overColId = columns[overId]
      ? overId
      : (findColumnIdForTask(overId) ?? activeColId);

    let finalOrder = 0;
    setColumns((prev) => {
      const items = [...prev[overColId]];
      const oldIndex = items.findIndex((t) => t.id === activeId);
      const newIndex = items.findIndex((t) => t.id === overId);
      const reordered =
        oldIndex >= 0 && newIndex >= 0
          ? arrayMove(items, oldIndex, newIndex)
          : items;
      finalOrder = reordered.findIndex((t) => t.id === activeId);
      return { ...prev, [overColId]: reordered };
    });

    try {
      // Backend broadcasts "task:moved" to everyone in the room (including
      // us) after this succeeds — our own re-application of that event is
      // a harmless no-op since the state is already correct.
      await taskApi.move(slug, projectId, activeId, {
        columnId: overColId,
        order: finalOrder,
      });
    } catch {
      await refresh();
    }
  }

  async function handleAddTask(
    columnId: string,
    title: string,
    priority: TaskPriority,
    assigneeId?: string,
  ) {
    await taskApi.create(slug, projectId, columnId, {
      title,
      priority,
      assigneeId,
    });
    // No local state push here — the "task:created" socket event (which we
    // also receive) adds it, avoiding a duplicate-then-dedupe dance.
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
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="h-9 rounded-xl border border-black/[0.08] bg-white pl-8 pr-3 text-xs outline-none focus:border-nexus/40"
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setHighPriorityOnly((v) => !v)}
          >
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
        <div className="grid gap-3 overflow-x-auto pb-4 md:grid-cols-4">
          {project.board.columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={visibleColumns[col.id] ?? []}
              members={members}
              onTaskClick={(task) => setOpenTaskId(task.id)}
              onAddTask={(title, priority, assigneeId) =>
                handleAddTask(col.id, title, priority, assigneeId)
              }
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
