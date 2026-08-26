"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { invitationApi, memberApi } from "@/lib/api";
import { CreateInvitationInput, WorkspaceRole } from "@/hooks/type";

export default function MembersPage() {
  const { workspace, members, myRole, refresh } = useWorkspaceContext();
  const [showInvite, setShowInvite] = useState(false);
  const canManage = myRole === "OWNER" || myRole === "ADMIN";

  if (!workspace) return null;

  const handleRoleChange = async (userId: string, role: Exclude<WorkspaceRole, "OWNER">) => {
    await memberApi.updateRole(workspace.slug, userId, { role });
    await refresh();
  };

  const handleRemove = async (userId: string) => {
    await memberApi.remove(workspace.slug, userId);
    await refresh();
  };

  return (
    <>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d5dfb]">
            Members
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            {members.length} {members.length === 1 ? "member" : "members"}
          </h1>
        </div>
        {canManage && (
          <button
            onClick={() => setShowInvite(true)}
            className="flex h-11 items-center gap-2 rounded-xl bg-[#111] px-4 text-sm font-semibold text-white transition hover:bg-black"
          >
            <UserPlus size={16} />
            Invite
          </button>
        )}
      </div>

      <div className="divide-y divide-black/[0.06] rounded-2xl border border-black/[0.06] bg-white">
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#6d5dfb] text-xs font-bold text-white">
                {m.user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{m.user.name}</p>
                <p className="text-xs text-black/40">{m.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {canManage && m.role !== "OWNER" ? (
                <select
                  value={m.role}
                  onChange={(e) =>
                    handleRoleChange(m.user.id, e.target.value as Exclude<WorkspaceRole, "OWNER">)
                  }
                  className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold"
                >
                  <option value="MEMBER">MEMBER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              ) : (
                <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-bold">
                  {m.role}
                </span>
              )}

              {canManage && m.role !== "OWNER" && (
                <button
                  onClick={() => handleRemove(m.user.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showInvite && (
          <InviteModal slug={workspace.slug} onClose={() => setShowInvite(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function InviteModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<WorkspaceRole, "OWNER">>("MEMBER");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSending(true);
      setError(null);
      const payload: CreateInvitationInput = { email, role };
      const data = await invitationApi.create(slug, payload);
      setToken(data.invitation.token); // dev-only: show token directly (no email sending yet)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-md rounded-3xl border border-black/[0.06] bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-black">Invite a member</h2>
          <button onClick={onClose} className="text-black/40 hover:text-black">
            <X size={18} />
          </button>
        </div>

        {token ? (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-black/60">
              Invitation created. Since email sending isn't wired up yet, share this link
              directly with them:
            </p>
            <code className="block break-all rounded-xl bg-black/[0.04] p-3 text-xs">
              {`${window.location.origin}/invitations/${token}`}
            </code>
            <button
              onClick={onClose}
              className="h-11 w-full rounded-xl bg-[#111] text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3.5 text-sm outline-none focus:border-[#6d5dfb]/40 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Exclude<WorkspaceRole, "OWNER">)}
                className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3.5 text-sm outline-none"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={!email.trim() || sending}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#111] text-sm font-semibold text-white transition hover:bg-black disabled:opacity-40"
            >
              {sending ? "Sending..." : "Send invitation"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}