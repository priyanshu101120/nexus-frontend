// ─────────────────────────────────────────────────────────
// Nexus — Shared Frontend Types
// Mirror these EXACTLY against backend response shapes.
// If a backend `select`/`include` changes, update here too.
// ─────────────────────────────────────────────────────────

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

// ── Auth ─────────────────────────────────────────────────

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string; // ISO date string over the wire
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

// ── Members (list view — with nested user) ──────────────

export interface MemberWithUser {
  id: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: Pick<SafeUser, "id" | "name" | "email" | "avatarUrl">;
}

export interface UpdateMemberRoleInput {
  role: Exclude<WorkspaceRole, "OWNER">; // OWNER can't be granted this way
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
  startDate?: string; // ISO datetime
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

// What POST /projects returns: project + its freshly created board+columns
export interface ProjectWithBoard extends Project {
  board: Board & { columns: Column[] };
}

// What GET /projects/:id returns: full nested board with tasks
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

// ── API envelope helpers ─────────────────────────────────
// Every backend error response looks like this (see error.middleware.ts)

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>; // present on 400 validation errors
}

// Generic wrapper if you want to type fetch/axios responses:
// e.g. ApiResponse<{ workspace: WorkspaceWithMembers }>
export type ApiResponse<T> = T;