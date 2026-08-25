import { CreateWorkspaceInput, LoginInput, RegisterInput } from "@/hooks/type";
import { LogOut } from "lucide-react";

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
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
}

export const authApi = {
  register: (payload: RegisterInput) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login: (payload: LoginInput) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  logOut: () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },
  getMe: () => {
    return apiRequest("/auth/me", {
      method: "GET",
    });
  },
};
export const workspaceApi = {
  createWorkspace: (payload: CreateWorkspaceInput) => {
    return apiRequest("/workspace", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getWorkspace: () => {
    return apiRequest("/workspace", {
      method: "GET",
    });
  },
  getBySlug: (slug: string) => {
    return apiRequest(`/workspace/${slug}`, {
      method: "GET",
    });
  },
};
