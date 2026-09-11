// ─────────────────────────────────────────────────────────
// Nexus — Shared Frontend Types (canonical: @/hooks/type)
// Mirror these EXACTLY against backend response shapes.
// ─────────────────────────────────────────────────────────

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type NotificationType = "INVITATION" | "GENERAL";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  userId: string;

  invitationId?: string | null;

  invitation?: {
    id: string;
    email: string;
    role: "ADMIN" | "MEMBER";
    token: string;
    accepted: boolean;
    workspaceId: string;
    invitedById: string;

    workspace: {
      id: string;
      name: string;
      slug: string;
    };

    invitedBy: {
      id: string;
      name: string;
      email: string;
    };
  } | null;
}



// ── Auth ─────────────────────────────────────────────────

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: SafeUser;
}

// ── Workspace ────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberSummary {
  id: string;
  role: WorkspaceRole;
  joinedAt: string;
  userId: string;
  workspaceId: string;
}

export interface WorkspaceWithMembers extends Workspace {
  members: WorkspaceMemberSummary[];
}

export interface CreateWorkspaceInput {
  name: string;
  slug: string;
}

// ── Members ──────────────────────────────────────────────

export interface MemberWithUser {
  id: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: Pick<SafeUser, "id" | "name" | "email" | "avatarUrl">;
}

export interface UpdateMemberRoleInput {
  role: Exclude<WorkspaceRole, "OWNER">;
}

// ── Invitations ──────────────────────────────────────────

export interface Invitation {
  id: string;
  email: string;
  role: WorkspaceRole;
  token: string;
  accepted: boolean;
  createdAt: string;
  workspaceId: string;
  invitedById: string;
}

export interface InvitationWithInviter extends Invitation {
  invitedBy: Pick<SafeUser, "id" | "name" | "email">;
}

export interface CreateInvitationInput {
  email: string;
  role: Exclude<WorkspaceRole, "OWNER">;
}

// ── Projects & Boards ────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  startDate?: string;
  dueDate?: string;
}

export interface Column {
  id: string;
  name: string;
  order: number;
  boardId: string;
}

export interface Board {
  id: string;
  projectId: string;
  createdAt: string;
}

export interface ProjectWithBoard extends Project {
  board: Board & { columns: Column[] };
}

export interface ProjectWithFullBoard extends Project {
  board: Board & {
    columns: (Column & { tasks: Task[] })[];
  };
}

// ── Tasks ────────────────────────────────────────────────

export interface TaskAssignee {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface TaskColumnInfo {
  id: string;
  name: string;
  board?: {
    project: {
      id: string;
      name: string;
    };
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  order: number;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  columnId: string;
  assigneeId?: string | null;
  assignee?: TaskAssignee | null;
  column?: TaskColumnInfo; // <-- ADD THIS LINE (optional — only present on the flat workspace-tasks response)
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
}

export interface MoveTaskInput {
  columnId: string;
  order: number;
}

// ── Comments ─────────────────────────────────────────────

export interface CommentAuthor {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  taskId: string;
  userId: string;
  user: CommentAuthor;
}

export interface CreateCommentInput {
  content: string;
}

// ── API envelope ─────────────────────────────────────────

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}