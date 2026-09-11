"use client";

import { useParams } from "next/navigation";
import { TasksPage } from "@/components/TaskPage";

export default function Page() {
  const params = useParams();

  const slug = params.slug as string;

  return <TasksPage slug={slug} />;
}