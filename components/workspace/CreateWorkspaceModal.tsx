import { CreateWorkspaceInput } from '@/hooks/type';
import React, { useState } from 'react'
import { motion } from "motion/react";
import { ArrowRight, X } from 'lucide-react';

const CreateWorkspaceModal = ({
  creating,
  error,
  onCreate,
  onClose,
}: {
  creating: boolean;
  error: string | null;
  onCreate: (payload: CreateWorkspaceInput) => Promise<any>;
  onClose: () => void;
}) => {
   const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
  
    const handleNameChange = (value: string) => {
      setName(value);
      if (!slugTouched) setSlug(slugify(value));
    };
  
    const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !slug.trim()) return;
  
      const result = await onCreate({ name: name.trim(), slug: slug.trim() });
      if (result) onClose();
    };
   return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="w-full max-w-md rounded-3xl border border-black/[0.06] bg-white p-6 shadow-2xl sm:p-7"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d5dfb]">
                New workspace
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Create a workspace
              </h2>
              <p className="mt-1 text-sm text-black/45">
                Start a new space for your team and projects.
              </p>
            </div>
  
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-lg text-black/40 hover:bg-black/[0.04] hover:text-black"
            >
              <X size={17} />
            </button>
          </div>
  
          <form onSubmit={handleCreate} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">
                Workspace name
              </span>
              <input
                autoFocus
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Nexus Studio"
                className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3.5 text-sm outline-none transition focus:border-[#6d5dfb]/40 focus:bg-white focus:ring-4 focus:ring-[#6d5dfb]/5"
              />
            </label>
  
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">
                Workspace URL
              </span>
              <div className="flex items-center rounded-xl border border-black/[0.08] bg-[#fafafa] pl-3.5 text-sm focus-within:border-[#6d5dfb]/40 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6d5dfb]/5">
                <span className="text-black/35">nexus.app/</span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="my-workspace"
                  className="h-11 w-full bg-transparent px-1.5 outline-none"
                />
              </div>
            </label>
  
            {error && <p className="text-xs text-red-600">{error}</p>}
  
            <button
              type="submit"
              disabled={!name.trim() || !slug.trim() || creating}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#111] text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {creating ? "Creating..." : "Create workspace"}
              {!creating && <ArrowRight size={15} />}
            </button>
          </form>
        </motion.div>
      </motion.div>
    );
}
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
export default CreateWorkspaceModal