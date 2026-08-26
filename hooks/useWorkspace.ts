import { useCallback, useEffect, useState } from "react";
import { CreateWorkspaceInput, Workspace } from "@/hooks/type";
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
      const data = await workspaceApi.list();
      setWorkspace(data.workspace);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load workspaces";
      setError(message);
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
      const data = await workspaceApi.create(payload);
      setWorkspace((prev) => [...prev, data.workspace]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create workspace";
      setError(message);
      return null;
    } finally {
      setCreating(false);
    }
  };

  const getWorkspaceBySlug = async (slug: string) => {
    try {
      setError(null);
      return await workspaceApi.getBySlug(slug);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load workspace";
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