import React from "react";
import { Workspace } from "@/hooks/type";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const WorkspaceCard = ({
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.025)] transition duration-300 hover:-translate-y-1 hover:border-black/[0.12] hover:shadow-[0_20px_50px_rgba(0,0,0,0.07)]"
    >
      <div className="relative">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[#6d5dfb] text-sm font-black text-white shadow-lg">
          {workspace.name.slice(0, 2).toUpperCase()}
        </div>

        <h3 className="text-lg font-bold tracking-tight">{workspace.name}</h3>
        <p className="mt-1 text-sm text-black/45">/{workspace.slug}</p>

        <div className="mt-6 flex items-center gap-4 border-t border-black/[0.06] pt-4 text-xs text-black/40">
          <span>Created {formatDate(workspace.createdAt)}</span>
        </div>

        <div className="absolute bottom-0 right-0 grid h-8 w-8 translate-x-2 translate-y-2 place-items-center rounded-full bg-black text-white opacity-0 transition group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowRight size={15} />
        </div>
      </div>
    </motion.button>
  );
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default WorkspaceCard;
