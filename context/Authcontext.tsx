"use client";

import {
  LoginInput,
  RegisterInput,
  SafeUser,
} from "@/hooks/type";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

interface AuthContextValue {
  user: SafeUser | null;
  loading: boolean;
  login: (payload: LoginInput) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function Authprovider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // ───────────────────────────────────────────────────────
  // RESTORE SESSION
  // ───────────────────────────────────────────────────────

 useEffect(() => {
  let mounted = true;

  const restoreSession = async () => {
    try {
      // Refresh token is stored in HttpOnly cookie.
      // Get a fresh access token first.
      const accessToken = await authApi.refresh();

      if (!accessToken) {
        throw new Error("Session expired");
      }

      // Now that access token exists in memory,
      // fetch the current user.
      const data = await authApi.getMe();

      if (!mounted) return;

      setUser(data.user);
    } catch {
      if (!mounted) return;

      setUser(null);
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  restoreSession();

  return () => {
    mounted = false;
  };
}, []);
  // ───────────────────────────────────────────────────────
  // LOGIN
  // ───────────────────────────────────────────────────────

  const login = useCallback(
    async (payload: LoginInput) => {
      const data = await authApi.login(payload);

      setUser(data.user);
    },
    [],
  );

  // ───────────────────────────────────────────────────────
  // REGISTER
  // ───────────────────────────────────────────────────────

  const register = useCallback(
    async (payload: RegisterInput) => {
      const data = await authApi.register(payload);

      setUser(data.user);
    },
    [],
  );

  // ───────────────────────────────────────────────────────
  // GOOGLE LOGIN
  // ───────────────────────────────────────────────────────

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const data = await authApi.google(idToken);

      setUser(data.user);
    },
    [],
  );

  // ───────────────────────────────────────────────────────
  // LOGOUT
  // ───────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  // ───────────────────────────────────────────────────────
  // AUTH INITIALIZATION
  // ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = use(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }

  return context;
}