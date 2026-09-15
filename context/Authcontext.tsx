"use client";
import { LoginInput, RegisterInput, SafeUser } from "@/hooks/type";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { createContext, use, useCallback, useEffect, useState } from "react";

interface AuthContextValue {
  user: SafeUser | null;
  loading: boolean; // true only during the initial getMe() check on app load
  login: (payload: LoginInput) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>; // <-- ADD
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function Authprovider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await authApi.getMe();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (payload: LoginInput) => {
    const data = await authApi.login(payload);
    setUser(data.user);
  }, []);
  const register = useCallback(async (payload: RegisterInput) => {
    const data = await authApi.register(payload);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    router.push("/login");
  }, [router]);
  const loginWithGoogle = useCallback(async (idToken: string) => {
    const data = await authApi.google(idToken);
    setUser(data.user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
