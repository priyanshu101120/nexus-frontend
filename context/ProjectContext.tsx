'use client';
import { ProjectWithFullBoard } from "@/hooks/type";
import { projectApi } from "@/lib/api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ProjectContextValue {
  project: ProjectWithFullBoard | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  // Derived stats — the backend Project model has no `progress`/`members`
  // fields, so these are computed from the board's actual task data.
  taskCounts: { total: number; done: number };
  progressPercent: number;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined,
);

export function ProjectProvider({
  slug,
  projectId,
  children,
}: {
  slug: string;
  projectId: string;
  children: React.ReactNode;
}) {
  const [project, setProject] = useState<ProjectWithFullBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectApi.getById(slug, projectId);
      setProject(data.project);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load project",
      );
    } finally {
      setLoading(false);
    }
  }, [slug, projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const { taskCounts, progressPercent } = useMemo(() => {
    if (!project)
      return { taskCounts: { total: 0, done: 0 }, progressPercent: 0 };

    const columns = project.board?.columns ?? [];
    const total = columns.reduce((sum, col) => sum + col.tasks.length, 0);
    // "Done" is identified by column name, matching the default column
    // created for every new project (see backend project.repository.ts)
    const done = columns
      .filter((col) => col.name.trim().toUpperCase() === "DONE")
      .reduce((sum, col) => sum + col.tasks.length, 0);

    return {
      taskCounts: { total, done },
      progressPercent: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }, [project]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        loading,
        error,
        refresh: load,
        taskCounts,
        progressPercent,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const ctx = useContext(ProjectContext);
  if (!ctx)
    throw new Error("useProjectContext must be used inside <ProjectProvider>");
  return ctx;
}
