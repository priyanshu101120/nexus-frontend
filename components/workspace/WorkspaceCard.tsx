import React, { useState } from "react";
import { Workspace } from "@/hooks/type";
import { Star, MoreHorizontal, LayoutGrid, Calendar } from "lucide-react";
import { motion } from "motion/react";

const EMOJIS = ["🎨", "⚽", "🦔", "👨‍⚕️", "🎅", "🚀", "💼", "🎮", "🧪", "📱"];

const WorkspaceCard = ({
  workspace,
  index,
  onClick,
}: {
  workspace: Workspace;
  index: number;
  onClick: () => void;
}) => {
  const [isStarred, setIsStarred] = useState(false);

  // Pick an emoji deterministically based on workspace name/index
  const emoji = EMOJIS[index % EMOJIS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
    >
      <div>
        {/* Top bar: Emoji avatar + Action icons */}
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl shadow-inner">
            {emoji}
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsStarred(!isStarred);
              }}
              className={`transition hover:text-amber-400 ${
                isStarred ? "text-amber-400 fill-amber-400" : ""
              }`}
            >
              <Star size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="hover:text-gray-600"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-5">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">
            {workspace.name}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-400 line-clamp-2">
            /{workspace.slug} • Workspace project management & team collaboration space.
          </p>
        </div>
      </div>

      {/* Metadata & Avatar Stack */}
      <div className="mt-6 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-2 text-xs font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <LayoutGrid size={15} className="text-gray-400" />
              <span>Task: Practice</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-gray-400" />
              <span>Date: {formatDate(workspace.createdAt)}</span>
            </div>
          </div>

          {/* User Avatars Stack */}
          <div className="flex -space-x-2 overflow-hidden self-end">
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-amber-200 text-[10px] font-bold flex items-center justify-center text-amber-800">
              JD
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-purple-200 text-[10px] font-bold flex items-center justify-center text-purple-800">
              SK
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#0b2f3f] text-[9px] font-bold text-white flex items-center justify-center">
              +3
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export default WorkspaceCard;