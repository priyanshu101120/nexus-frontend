import { useCallback, useEffect, useState } from "react";
import { projectApi } from "@/lib/api";
import { Project, ProjectWithFullBoard } from "./type";
import { useWorkspaceContext } from "@/context/WorkspaceContext";

export interface ProjectOverview extends Pick<Project, "id" | "name" | "description" | "color"> {
  total: number;
  done: number;
  progress: number;
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

      // Har project ka progress nikalne ke liye uska poora board (tasks) fetch
      // karna padta hai — backend Project model me `progress` field nahi hai.
      const detailed = await Promise.all(
        list.map(async (p): Promise<ProjectOverview> => {
          try {
            const data = await projectApi.getById(workspace.slug, p.id);
            const full: ProjectWithFullBoard = data.project;
            const columns = full.board?.columns ?? [];

            const total = columns.reduce((sum, c) => sum + c.tasks.length, 0);
            const done = columns
              .filter((c) => c.name.trim().toUpperCase() === "DONE")
              .reduce((sum, c) => sum + c.tasks.length, 0);

            return {
              id: p.id,
              name: p.name,
              description: p.description,
              color: p.color,
              total,
              done,
              progress: total === 0 ? 0 : Math.round((done / total) * 100),
            };
          } catch {
            // Ek project fail ho jaye to baaki dikhte rahein
            return {
              id: p.id,
              name: p.name,
              description: p.description,
              color: p.color,
              total: 0,
              done: 0,
              progress: 0,
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

  return { projects, loading, refresh: load };
};

export default useProjectsOverview;