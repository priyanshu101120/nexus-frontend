import { useCallback, useEffect, useState } from "react";
import { projectApi } from "@/lib/api";
import {
  Project,
  ProjectWithFullBoard,
  TaskAssignee,
} from "./type";
import { useWorkspaceContext } from "@/context/WorkspaceContext";

export interface ProjectOverview
  extends Pick<Project, "id" | "name" | "description" | "color"> {
  total: number;
  done: number;
  progress: number;
  assignees: TaskAssignee[];
}

const useProjectsOverview = () => {
  const { workspace } = useWorkspaceContext();

  const [projects, setProjects] = useState<ProjectOverview[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!workspace) return;

    try {
      setLoading(true);

      const listData = await projectApi.list(workspace.slug);
      const list: Project[] = listData.projects ?? [];

      // Har project ka progress + assigned users nikalne ke liye
      // uska complete board fetch kar rahe hain.
      const detailed = await Promise.all(
        list.map(async (p): Promise<ProjectOverview> => {
          try {
            const data = await projectApi.getById(
              workspace.slug,
              p.id,
            );

            const full: ProjectWithFullBoard = data.project;
            const columns = full.board?.columns ?? [];

            // All tasks from all columns
            const tasks = columns.flatMap((column) => column.tasks);

            // Total tasks
            const total = tasks.length;

            // Completed tasks
            const done = columns
              .filter(
                (column) =>
                  column.name.trim().toUpperCase() === "DONE",
              )
              .reduce(
                (sum, column) => sum + column.tasks.length,
                0,
              );

            /*
             * Project ke actual task assignees.
             *
             * Same user ke multiple tasks ho sakte hain,
             * isliye Map use karke unique assignees nikal rahe hain.
             */
            const assignees = Array.from(
              new Map(
                tasks
                  .filter(
                    (
                      task,
                    ): task is typeof task & {
                      assignee: TaskAssignee;
                    } => Boolean(task.assignee),
                  )
                  .map((task) => [
                    task.assignee.id,
                    task.assignee,
                  ]),
              ).values(),
            );

            return {
              id: p.id,
              name: p.name,
              description: p.description,
              color: p.color,
              total,
              done,
              progress:
                total === 0
                  ? 0
                  : Math.round((done / total) * 100),
              assignees,
            };
          } catch {
            // Agar ek project ka detail request fail ho,
            // to baaki projects phir bhi render honge.
            return {
              id: p.id,
              name: p.name,
              description: p.description,
              color: p.color,
              total: 0,
              done: 0,
              progress: 0,
              assignees: [],
            };
          }
        }),
      );

      setProjects(detailed);
    } finally {
      setLoading(false);
    }
  }, [workspace]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    projects,
    loading,
    refresh: load,
  };
};

export default useProjectsOverview;