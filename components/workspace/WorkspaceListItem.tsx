import { Workspace } from '@/hooks/type';
import { ArrowRight } from 'lucide-react';
import { motion } from "motion/react";
import React from 'react'

const WorkspaceListItem = ({
  workspace,
  index,
  onClick,
}: {
  workspace: Workspace;
  index: number;
  onClick: () => void;
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-black/[0.07] bg-white p-4 text-left transition hover:border-[#6d5dfb] hover:shadow-lg"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#6d5dfb] text-xs font-black text-white">
        {workspace.name.slice(0, 2).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold">{workspace.name}</h3>
        <p className="mt-0.5 truncate text-xs text-black/40">
          /{workspace.slug}
        </p>
      </div>

      <div className="hidden items-center gap-5 text-xs text-black/40 sm:flex">
        <span>Created {formatDate(workspace.createdAt)}</span>
      </div>

      <ArrowRight
        size={16}
        className="text-black/25 transition group-hover:translate-x-1 group-hover:text-black"
      />
    </motion.button>
  );
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default WorkspaceListItem