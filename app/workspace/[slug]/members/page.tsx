"use client";

import { useState } from "react";
import {
  UserPlus,
  X,
  Search,
  MoreVertical,
  Shield,
  ShieldCheck,
  User,
  Trash2,
  Users,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  Filter,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { invitationApi, memberApi } from "@/lib/api";
import { CreateInvitationInput, WorkspaceRole } from "@/hooks/type";

export default function MembersPage() {
  const { workspace, members, myRole, refresh } = useWorkspaceContext();
  const [showInvite, setShowInvite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
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

  // Filter members based on search and selected role
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate statistics for the right sidebar widget
  const totalCount = members.length;
  const ownerCount = members.filter((m) => m.role === "OWNER").length;
  const adminCount = members.filter((m) => m.role === "ADMIN").length;
  const memberCount = members.filter((m) => m.role === "MEMBER").length;

  return (
    <div className="-m-6 min-h-screen bg-[#f4f5f9] p-6 lg:p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* TOP CONTROLS & HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              People & Team
            </h1>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              Manage workspace members, roles, and access permissions for {workspace.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-2xl border-none bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6d5dfb]/30"
              />
            </div>

            {canManage && (
              <button
                onClick={() => setShowInvite(true)}
                className="flex h-10 items-center gap-2 rounded-2xl bg-[#6d5dfb] px-4 text-xs font-bold text-white shadow-md shadow-[#6d5dfb]/20 transition hover:bg-[#5b4be3] shrink-0"
              >
                <UserPlus size={16} />
                <span>Invite Member</span>
              </button>
            )}
          </div>
        </div>

        {/* MAIN CONTENT GRID (Members Grid + Right Summary Sidebar) */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* LEFT 8 COLUMNS: Members Cards Grid */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {["ALL", "OWNER", "ADMIN", "MEMBER"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      roleFilter === role
                        ? "bg-[#6d5dfb] text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {role === "ALL" ? "All Members" : role}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-bold text-slate-400 px-2">
                Showing {filteredMembers.length} of {totalCount}
              </div>
            </div>

            {/* Member Cards */}
            {filteredMembers.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#6d5dfb]">
                  <Users size={24} />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">No members found</h3>
                <p className="mx-auto mt-1 max-w-sm text-xs font-medium text-slate-400">
                  Try adjusting your search or role filter to find team members.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredMembers.map((m) => {
                  const initials = m.user.name.slice(0, 2).toUpperCase();
                  const isOwner = m.role === "OWNER";
                  const isAdmin = m.role === "ADMIN";

                  return (
                    <div
                      key={m.id}
                      className="group relative flex flex-col justify-between rounded-[28px] bg-white p-5 shadow-sm border border-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div>
                        {/* Card Header & Role Badge */}
                        <div className="flex items-start justify-between">
                          <div className="relative">
                            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#6d5dfb] to-[#9b8eff] text-base font-black text-white shadow-md shadow-[#6d5dfb]/20">
                              {initials}
                            </div>
                            {/* Online/Role Status Indicator dot */}
                            <span
                              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                                isOwner
                                  ? "bg-amber-500"
                                  : isAdmin
                                  ? "bg-purple-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                          </div>

                          {/* Role selector or plain badge */}
                          {canManage && !isOwner ? (
                            <select
                              value={m.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  m.user.id,
                                  e.target.value as Exclude<WorkspaceRole, "OWNER">
                                )
                              }
                              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 outline-none transition focus:border-[#6d5dfb]"
                            >
                              <option value="MEMBER">MEMBER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[10px] font-extrabold ${
                                isOwner
                                  ? "bg-amber-50 text-amber-600"
                                  : isAdmin
                                  ? "bg-purple-50 text-purple-600"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {isOwner ? <ShieldCheck size={12} /> : <User size={12} />}
                              {m.role}
                            </span>
                          )}
                        </div>

                        {/* User Details */}
                        <div className="mt-4">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#6d5dfb] transition">
                            {m.user.name}
                          </h3>
                          <p className="text-xs font-medium text-slate-400 mt-0.5 truncate">
                            {m.user.email}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400">
                          Joined Workspace
                        </span>

                        {canManage && !isOwner && (
                          <button
                            onClick={() => handleRemove(m.user.id)}
                            className="flex items-center gap-1 text-xs font-bold text-rose-500 opacity-80 hover:opacity-100 hover:underline transition"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT 4 COLUMNS: Workspace Team Widget */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[32px] bg-white p-6 shadow-sm border border-slate-100 space-y-6">
              
              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  TEAM OVERVIEW
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  {workspace.name}
                </h2>

                {/* Circular Gauge Meter for Team Capacity */}
                <div className="relative my-6 flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#f1f5f9"
                      strokeWidth="7"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#6d5dfb"
                      strokeWidth="7"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - Math.min(totalCount / 20, 1))}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900">{totalCount}</span>
                    <span className="text-[10px] font-bold text-slate-400">Members</span>
                  </div>
                </div>
              </div>

              {/* Role Breakdown Mini Grid */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-800 mb-2">Role Breakdown</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100/60">
                    <p className="text-[10px] font-bold text-slate-400">OWNERS</p>
                    <p className="text-lg font-black text-slate-800 mt-1">{ownerCount}</p>
                  </div>
                  <div className="rounded-2xl bg-purple-50/50 p-3 border border-purple-100/50">
                    <p className="text-[10px] font-bold text-purple-600">ADMINS</p>
                    <p className="text-lg font-black text-[#6d5dfb] mt-1">{adminCount}</p>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-slate-50 p-3 border border-slate-100/60 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">STANDARD MEMBERS</p>
                      <p className="text-base font-black text-slate-800 mt-0.5">{memberCount}</p>
                    </div>
                    <Users size={20} className="text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Quick Invite Promo Box */}
              {canManage && (
                <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4 border border-purple-100 text-center space-y-2">
                  <Sparkles className="mx-auto text-[#6d5dfb]" size={20} />
                  <h4 className="text-xs font-extrabold text-slate-900">Grow Your Workspace</h4>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                    Invite team members to collaborate on projects and assign tasks seamlessly.
                  </p>
                  <button
                    onClick={() => setShowInvite(true)}
                    className="w-full mt-2 rounded-xl bg-[#6d5dfb] py-2 text-xs font-bold text-white shadow-sm hover:bg-[#5b4be3] transition"
                  >
                    Send Invitation
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* INVITE MEMBER MODAL */}
      <AnimatePresence>
        {showInvite && (
          <InviteModal slug={workspace.slug} onClose={() => setShowInvite(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================================
   INVITE MODAL COMPONENT
============================================================================ */

function InviteModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<WorkspaceRole, "OWNER">>("MEMBER");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSending(true);
      setError(null);
      const payload: CreateInvitationInput = { email, role };
      const data = await invitationApi.create(slug, payload);
      setToken(data.invitation.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  const inviteUrl = token ? `${window.location.origin}/invitations/${token}` : "";

  const handleCopy = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md rounded-[32px] border border-slate-100 bg-white p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Invite Team Member</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Send an invitation link to join this workspace
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {token ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100 text-center">
              <p className="text-xs font-bold text-emerald-800">
                Invitation created successfully! 🎉
              </p>
              <p className="text-[11px] font-medium text-emerald-600 mt-1">
                Share this direct invite link with the member:
              </p>
            </div>

            <div className="relative">
              <input
                readOnly
                value={inviteUrl}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-3.5 pr-11 text-xs font-mono text-slate-700 outline-none"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-white p-2 text-slate-600 shadow-sm border border-slate-200 hover:text-[#6d5dfb] transition"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>

            <button
              onClick={onClose}
              className="h-11 w-full rounded-2xl bg-[#6d5dfb] text-xs font-bold text-white shadow-md shadow-[#6d5dfb]/20 hover:bg-[#5b4be3] transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Email Address</span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition focus:border-[#6d5dfb] focus:bg-white focus:ring-2 focus:ring-[#6d5dfb]/20"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Workspace Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Exclude<WorkspaceRole, "OWNER">)}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-800 outline-none transition focus:border-[#6d5dfb] focus:bg-white focus:ring-2 focus:ring-[#6d5dfb]/20"
              >
                <option value="MEMBER">MEMBER (Can view & edit assigned tasks)</option>
                <option value="ADMIN">ADMIN (Can manage projects & team members)</option>
              </select>
            </label>

            {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={!email.trim() || sending}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#6d5dfb] text-xs font-bold text-white shadow-md shadow-[#6d5dfb]/20 transition hover:bg-[#5b4be3] disabled:opacity-40"
              >
                {sending ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}