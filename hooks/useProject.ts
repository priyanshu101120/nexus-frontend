import { useCallback, useEffect, useState } from "react";
import { projectApi } from "@/lib/api";
import {
  CreateProjectInput,
  Project,
  ProjectWithFullBoard,
  TaskAssignee,
} from "./type";
import { useWorkspaceContext } from "@/context/WorkspaceContext";

export interface ProjectOverview extends Project {
  total: number;
  done: number;
  progress: number;
  assignees: TaskAssignee[];
}

const useProject = () => {
  const [projects, setProjects] = useState<ProjectOverview[]>([]);
  const [loading, setLoading] = useState(true);

  const { workspace } = useWorkspaceContext();

  const loadProjects = useCallback(async () => {
    if (!workspace) return;

    try {
      setLoading(true);

      // Get all projects of current workspace
      const data = await projectApi.list(workspace.slug);

      const list: Project[] = data.projects ?? [];

      // Get full board + tasks for every project
      const detailedProjects = await Promise.all(
        list.map(async (project): Promise<ProjectOverview> => {
          try {
            const projectData = await projectApi.getById(
              workspace.slug,
              project.id,
            );

            const fullProject: ProjectWithFullBoard =
              projectData.project;

            const columns = fullProject.board?.columns ?? [];

            // All tasks from all columns
            const tasks = columns.flatMap(
              (column) => column.tasks,
            );

            // Total tasks
            const total = tasks.length;

            // Completed tasks
            const done = columns
              .filter(
                (column) =>
                  column.name.trim().toUpperCase() === "DONE",
              )
              .reduce(
                (sum, column) =>
                  sum + column.tasks.length,
                0,
              );

            /*
             * Get only the users who are actually
             * assigned to tasks in THIS project.
             *
             * Map removes duplicate users when
             * one user has multiple tasks.
             */
            const assignees = Array.from(
              new Map(
                tasks
                  .filter((task) => Boolean(task.assignee))
                  .map((task) => [
                    task.assignee!.id,
                    task.assignee!,
                  ]),
              ).values(),
            );

            return {
              ...project,

              total,

              done,

              progress:
                total === 0
                  ? 0
                  : Math.round((done / total) * 100),

              assignees,
            };
          } catch (error) {
            console.error(
              `Failed to load project ${project.id}:`,
              error,
            );

            return {
              ...project,

              total: 0,
              done: 0,
              progress: 0,

              assignees: [],
            };
          }
        }),
      );

      

      setProjects(detailedProjects);
    } catch (error) {
      console.error(
        "Failed to load projects:",
        error,
      );

      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [workspace]);

  const createProject = async (payload: CreateProjectInput) => {
  if (!workspace) return null;

  const data = await projectApi.create(
    workspace.slug,
    payload,
  );

  await loadProjects();

  return data;
};

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

 return {
  projects,
  loading,
  refresh: loadProjects,
  createProject,
};
};

export default useProject;