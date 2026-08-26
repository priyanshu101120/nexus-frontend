import { MemberWithUser, WorkspaceWithMembers } from "@/hooks/type";
import { createContext, use, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./Authcontext";
import { memberApi, workspaceApi } from "@/lib/api";

interface WorkspaceContextValue {
  workspace: WorkspaceWithMembers | null;
  members: MemberWithUser[];
  myRole: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined,
);

export function WorkspaceProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const [workspace, setWorkspace] = useState<WorkspaceWithMembers | null>(null);
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

 const load = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    // Workspace pehle — ye critical hai
    const wsData = await workspaceApi.getBySlug(slug);
    setWorkspace(wsData.workspace ?? wsData);

    // Members alag try me — fail ho to bhi workspace dikhta rahe
    try {
      const membersData = await memberApi.list(slug);
      setMembers(membersData.members ?? []);
    } catch (memberErr) {
      console.warn("Members fetch failed:", memberErr);
      setMembers([]);
    }
  } catch (error) {
    console.error("Workspace load failed:", error);
    setError("Failed to load workspace data");
  } finally {
    setLoading(false);
  }
}, [slug]);


  useEffect(() => {
    load();
  }, [load]);

  const myRole = members.find((m) => m.user.id === user?.id)?.role ?? null;

  return (
    <WorkspaceContext.Provider
      value={{ workspace, members, myRole, loading, error, refresh: load }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context)
    throw new Error(
      "useWorkspaceContext must be used inside <WorkspaceProvider>",
    );
  return context;
}
