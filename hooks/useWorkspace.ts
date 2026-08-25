import { useCallback, useEffect, useState } from "react";
import { CreateWorkspaceInput, Workspace } from "./type";
import { workspaceApi } from "@/lib/api";

const useWorkspace = () => {
  const [workspace, setWorkspace] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const getWorkspace = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await workspaceApi.getWorkspace();

    console.log("WORKSPACE API RESPONSE:", data);
    console.log("WORKSPACE DATA:", data.workspace);

    setWorkspace(data.workspace ?? []);
  } catch (error) {
    console.error("WORKSPACE FETCH ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to load workspaces";

    setError(message);
    setWorkspace([]);
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => {
    getWorkspace();
  }, [getWorkspace]);
  const createWorkspace = async (payload: CreateWorkspaceInput) => {
    try {
      setCreating(true);
      setError(null);
      const data = await workspaceApi.createWorkspace(payload);
      if (data.workspace) {
        setWorkspace((prev) => [...prev, data.workspace]);
      }
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create workspace";
      setError(message);
    } finally {
      setCreating(false);
    }
  };
  const getWorkspaceBySlug = async (slug: string) => {
    try {
      setError(null);

      const data = await workspaceApi.getBySlug(slug);

      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load workspace";

      setError(message);
      throw new Error(message);
    }
  };
  return {
    workspace,
    loading,
    creating,
    error,
    getWorkspace,
    createWorkspace,
    getWorkspaceBySlug,
  };
};

export default useWorkspace;
