"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./Authcontext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f4] text-sm text-black/40">
        Loading...
      </div>
    );
  }

  if (!user) return null; // brief flash before redirect effect fires

  return <>{children}</>;
}
