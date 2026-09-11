"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Loader2 } from "lucide-react";

import { taskApi } from "@/lib/api";
import type { Task } from "@/hooks/type";
import { Card } from "@/components/ui";

export function TasksPage({ slug }: { slug: string }) {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await taskApi.list(slug);

        setTasks(data.tasks ?? []);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load tasks";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [slug]);

  const groupedTasks = useMemo(() => {
    return {
      todo: tasks.filter(
        (task) =>
          task.column?.name.trim().toUpperCase() === "TODO"
      ),

      inProgress: tasks.filter(
        (task) =>
          task.column?.name.trim().toUpperCase() === "IN PROGRESS"
      ),

      done: tasks.filter(
        (task) =>
          task.column?.name.trim().toUpperCase() === "DONE"
      ),
    };
  }, [tasks]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          size={22}
          className="animate-spin text-black/40"
        />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-red-500">{error}</p>
      </Card>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d5dfb]">
          Tasks
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight">
          All tasks
        </h1>

        <p className="mt-2 text-sm text-black/40">
          Tasks across this workspace.
        </p>
      </div>

      {tasks.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckSquare
            size={24}
            className="mx-auto text-black/30"
          />

          <h2 className="mt-4 font-semibold">
            No tasks yet
          </h2>

          <p className="mt-1 text-sm text-black/40">
            Tasks created in your workspace will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          <TaskSection
            title="To Do"
            tasks={groupedTasks.todo}
            onTaskClick={(taskId) =>
              router.push(
                `/workspace/${slug}/tasks/${taskId}`
              )
            }
          />

          <TaskSection
            title="In Progress"
            tasks={groupedTasks.inProgress}
            onTaskClick={(taskId) =>
              router.push(
                `/workspace/${slug}/tasks/${taskId}`
              )
            }
          />

          <TaskSection
            title="Done"
            tasks={groupedTasks.done}
            onTaskClick={(taskId) =>
              router.push(
                `/workspace/${slug}/tasks/${taskId}`
              )
            }
          />
        </div>
      )}
    </section>
  );
}

function TaskSection({
  title,
  tasks,
  onTaskClick,
}: {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}) {
  if (tasks.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold">{title}</h2>

        <span className="text-xs text-black/35">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => onTaskClick(task.id)}
            className="w-full text-left"
          >
            <Card className="p-4 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-black/40">
                      {task.description}
                    </p>
                  )}
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                    task.priority === "HIGH"
                      ? "bg-red-50 text-red-600"
                      : task.priority === "MEDIUM"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-green-50 text-green-600"
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-black/35">
                  {task.assignee?.name ?? "Unassigned"}
                </span>

                {task.dueDate && (
                  <span className="text-[11px] text-black/35">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}