
import {
  CreateWorkspaceInput,
  LoginInput,
  RegisterInput,
  CreateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
  MoveTaskInput,
  CreateCommentInput,
  CreateInvitationInput,
  UpdateMemberRoleInput,
} from "@/hooks/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
}

// ── Auth ─────────────────────────────────────────────────

export const authApi = {
  register: (payload: RegisterInput) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginInput) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: () => apiRequest("/auth/logout", { method: "POST" }),

  getMe: () => apiRequest("/auth/me", { method: "GET" }),
};

// ── Workspaces ───────────────────────────────────────────

export const workspaceApi = {
  create: (payload: CreateWorkspaceInput) =>
    apiRequest("/workspace", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  list: () => apiRequest("/workspace", { method: "GET" }),

  getBySlug: (slug: string) =>
    apiRequest(`/workspace/${slug}`, { method: "GET" }),
};

// ── Members & Invitations ────────────────────────────────

export const memberApi = {
  list: (slug: string) =>
    apiRequest(`/workspace/${slug}/members`, { method: "GET" }),

  updateRole: (slug: string, userId: string, payload: UpdateMemberRoleInput) =>
    apiRequest(`/workspace/${slug}/members/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (slug: string, userId: string) =>
    apiRequest(`/workspace/${slug}/members/${userId}`, { method: "DELETE" }),

  leave: (slug: string) =>
    apiRequest(`/workspace/${slug}/members/me`, { method: "DELETE" }),
};

export const invitationApi = {
  create: (slug: string, payload: CreateInvitationInput) =>
    apiRequest(`/workspace/${slug}/invitations`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  listPending: (slug: string) =>
    apiRequest(`/workspace/${slug}/invitations`, { method: "GET" }),

  accept: (token: string) =>
    apiRequest(`/invitation/${token}/accept`, { method: "POST" }),
};

// ── Projects & Boards ────────────────────────────────────

export const projectApi = {
  create: (slug: string, payload: CreateProjectInput) =>
    apiRequest(`/workspace/${slug}/projects`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  list: (slug: string) =>
    apiRequest(`/workspace/${slug}/projects`, { method: "GET" }),

  getById: (slug: string, projectId: string) =>
    apiRequest(`/workspace/${slug}/projects/${projectId}`, { method: "GET" }),
};

// ── Tasks ────────────────────────────────────────────────

export const taskApi = {
  create: (
    slug: string,
    projectId: string,
    columnId: string,
    payload: CreateTaskInput,
  ) =>
    apiRequest(
      `/workspace/${slug}/projects/${projectId}/columns/${columnId}/tasks`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),

  update: (
    slug: string,
    projectId: string,
    taskId: string,
    payload: UpdateTaskInput,
  ) =>
    apiRequest(`/workspace/${slug}/projects/${projectId}/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  move: (
    slug: string,
    projectId: string,
    taskId: string,
    payload: MoveTaskInput,
  ) =>
    apiRequest(
      `/workspace/${slug}/projects/${projectId}/tasks/${taskId}/move`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    ),

  remove: (slug: string, projectId: string, taskId: string) =>
    apiRequest(`/workspace/${slug}/projects/${projectId}/tasks/${taskId}`, {
      method: "DELETE",
    }),
};

// ── Comments ─────────────────────────────────────────────

export const commentApi = {
  create: (
    slug: string,
    projectId: string,
    taskId: string,
    payload: CreateCommentInput,
  ) =>
    apiRequest(
      `/workspace/${slug}/projects/${projectId}/tasks/${taskId}/comments`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),

  list: (slug: string, projectId: string, taskId: string) =>
    apiRequest(
      `/workspace/${slug}/projects/${projectId}/tasks/${taskId}/comments`,
      {
        method: "GET",
      },
    ),

  remove: (slug: string, projectId: string, commentId: string) =>
    apiRequest(
      `/workspace/${slug}/projects/${projectId}/comments/${commentId}`,
      {
        method: "DELETE",
      },
    ),
};
