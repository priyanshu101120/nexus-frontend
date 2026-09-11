"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { taskApi } from "@/lib/api";
import type { Task } from "@/hooks/type";
import { Card } from "@/components/ui";

export function TaskDetailPage({
  slug,
  taskId,
}: {
  slug: string;
  taskId: string;
}) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);

        const data = await taskApi.getById(slug, taskId);

        setTask(data.task);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load task"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [slug, taskId]);

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

  if (error || !task) {
    return (
      <Card className="p-8 text-center">
        <h1 className="font-semibold">
          Task not found
        </h1>

        <p className="mt-2 text-sm text-black/40">
          {error || "This task does not exist."}
        </p>
      </Card>
    );
  }

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d5dfb]">
        Task
      </p>

      <h1 className="mt-2 text-3xl font-black">
        {task.title}
      </h1>

      <p className="mt-3 text-sm text-black/50">
        {task.description || "No description yet."}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs text-black/40">Priority</p>
          <p className="mt-2 font-semibold">
            {task.priority}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs text-black/40">Assignee</p>
          <p className="mt-2 font-semibold">
            {task.assignee?.name ?? "Unassigned"}
          </p>
        </Card>
      </div>
    </section>
  );
}