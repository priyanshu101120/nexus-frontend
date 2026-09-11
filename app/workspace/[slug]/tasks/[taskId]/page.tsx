"use client";

import { useParams } from "next/navigation";
import { TaskDetailPage } from "@/components/task-detail-page";

export default function Page() {
  const params = useParams();

  const slug = params.slug as string;
  const taskId = params.taskId as string;

  return (
    <TaskDetailPage
      slug={slug}
      taskId={taskId}
    />
  );
}