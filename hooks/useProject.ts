import { projectApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { Project } from "./type";
import { useWorkspaceContext } from "@/context/WorkspaceContext";

const useProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { workspace } = useWorkspaceContext();

  useEffect(() => {
    const loadProject = async () => {
      if (!workspace) return;
      try {
        setLoading(true);
        const data = await projectApi.list(workspace.slug);
        setProjects(data.projects ?? []);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [workspace]);


  return { projects, loading };
};

export default useProject;
