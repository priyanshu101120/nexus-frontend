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
  AuthResponse,
} from "@/hooks/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─────────────────────────────────────────────────────────
// ACCESS TOKEN — MEMORY ONLY
// ─────────────────────────────────────────────────────────

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

// Prevent multiple API calls from triggering
// multiple refresh requests at the same time.
let refreshPromise: Promise<string | null> | null = null;

// ─────────────────────────────────────────────────────────
// REFRESH ACCESS TOKEN
// ─────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {
  // If another request is already refreshing,
  // wait for the same refresh request.
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        clearAccessToken();
        return null;
      }

      const data: AuthResponse = await res.json();

      setAccessToken(data.accessToken);

      return data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAccessToken();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─────────────────────────────────────────────────────────
// API REQUEST
// ─────────────────────────────────────────────────────────

async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
) {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  // Add access token from MEMORY
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  // ───────────────────────────────────────────────────────
  // ACCESS TOKEN EXPIRED
  // ───────────────────────────────────────────────────────

  if (
    res.status === 401 &&
    retry &&
    endpoint !== "/auth/refresh" &&
    endpoint !== "/auth/login" &&
    endpoint !== "/auth/register" &&
    endpoint !== "/auth/google"
  ) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      const retryHeaders = new Headers(options.headers);

      retryHeaders.set("Content-Type", "application/json");
      retryHeaders.set(
        "Authorization",
        `Bearer ${newAccessToken}`,
      );

      // Retry original request
      res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: retryHeaders,
      });
    }
  }

  const text = await res.text();

  let data: any = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// ─────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────

export const authApi = {
  register: async (payload: RegisterInput) => {
    const data: AuthResponse = await apiRequest(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      false,
    );

    setAccessToken(data.accessToken);

    return data;
  },

  login: async (payload: LoginInput) => {
    const data: AuthResponse = await apiRequest(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      false,
    );

    setAccessToken(data.accessToken);

    return data;
  },

  google: async (idToken: string) => {
    const data: AuthResponse = await apiRequest(
      "/auth/google",
      {
        method: "POST",
        body: JSON.stringify({ idToken }),
      },
      false,
    );

    setAccessToken(data.accessToken);

    return data;
  },

  logout: async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } finally {
      clearAccessToken();
    }
  },

  getMe: () =>
    apiRequest("/auth/me"),

  refresh: () =>
    refreshAccessToken(),
};

// ─────────────────────────────────────────────────────────
// WORKSPACES
// ─────────────────────────────────────────────────────────

export const workspaceApi = {
  create: (payload: CreateWorkspaceInput) =>
    apiRequest("/workspace", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  list: () =>
    apiRequest("/workspace", {
      method: "GET",
    }),

  getBySlug: (slug: string) =>
    apiRequest(`/workspace/${slug}`, {
      method: "GET",
    }),
};

// ─────────────────────────────────────────────────────────
// MEMBERS
// ─────────────────────────────────────────────────────────

export const memberApi = {
  list: (slug: string) =>
    apiRequest(`/workspace/${slug}/members`, {
      method: "GET",
    }),

  updateRole: (
    slug: string,
    userId: string,
    payload: UpdateMemberRoleInput,
  ) =>
    apiRequest(`/workspace/${slug}/members/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (
    slug: string,
    userId: string,
  ) =>
    apiRequest(`/workspace/${slug}/members/${userId}`, {
      method: "DELETE",
    }),

  leave: (slug: string) =>
    apiRequest(`/workspace/${slug}/members/me`, {
      method: "DELETE",
    }),
};

// ─────────────────────────────────────────────────────────
// INVITATIONS
// ─────────────────────────────────────────────────────────

export const invitationApi = {
  create: (
    slug: string,
    payload: CreateInvitationInput,
  ) =>
    apiRequest(`/workspace/${slug}/invitations`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  listPending: (slug: string) =>
    apiRequest(`/workspace/${slug}/invitations`, {
      method: "GET",
    }),

  accept: (token: string) =>
    apiRequest(`/invitations/${token}/accept`, {
      method: "POST",
    }),
};

// ─────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────

export const projectApi = {
  create: (
    slug: string,
    payload: CreateProjectInput,
  ) =>
    apiRequest(`/workspace/${slug}/projects`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  list: (slug: string) =>
    apiRequest(`/workspace/${slug}/projects`, {
      method: "GET",
    }),

  getById: (
    slug: string,
    projectId: string,
  ) =>
    apiRequest(
      `/workspace/${slug}/projects/${projectId}`,
      {
        method: "GET",
      },
    ),
};

// ─────────────────────────────────────────────────────────
// TASKS
// ─────────────────────────────────────────────────────────

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
    apiRequest(
      `/workspace/${slug}/projects/${projectId}/tasks/${taskId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    ),

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

  remove: (
    slug: string,
    projectId: string,
    taskId: string,
  ) =>
    apiRequest(
      `/workspace/${slug}/projects/${projectId}/tasks/${taskId}`,
      {
        method: "DELETE",
      },
    ),

  list: (slug: string) =>
    apiRequest(`/workspace/${slug}/tasks`),

  getById: (
    slug: string,
    taskId: string,
  ) =>
    apiRequest(`/workspace/${slug}/tasks/${taskId}`),
};

// ─────────────────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────────────────

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

  list: (
    slug: string,
    projectId: string,
    taskId: string,
  ) =>
    apiRequest(
      `/workspace/${slug}/projects/${projectId}/tasks/${taskId}/comments`,
      {
        method: "GET",
      },
    ),

  remove: (
    slug: string,
    projectId: string,
    commentId: string,
  ) =>
    apiRequest(
      `/workspace/${slug}/projects/${projectId}/comments/${commentId}`,
      {
        method: "DELETE",
      },
    ),
};

// ─────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────

export const notificationApi = {
  list: () =>
    apiRequest("/notifications"),

  markAsRead: (id: string) =>
    apiRequest(`/notifications/${id}/read`, {
      method: "PATCH",
    }),

  markAllAsRead: () =>
    apiRequest("/notifications/read-all", {
      method: "PATCH",
    }),
};