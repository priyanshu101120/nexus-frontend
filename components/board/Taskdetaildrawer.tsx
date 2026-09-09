"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, Trash2 } from "lucide-react";
import { Task } from "@/hooks/type";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import useTask from "@/hooks/useTask";

function formatDueDate(iso?: string | null) {
  if (!iso) return "No due date";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function TaskDetailDrawer({
  task,
  columnName,
  slug,
  projectId,
  onClose,
  onDeleted,
}: {
  task: Task;
  columnName: string;
  slug: string;
  projectId: string;
  onClose: () => void;
  onDeleted: (taskId: string) => void;
}) {
  const { comments, loadingComments, posting, deleting, postComment, deleteTask } = useTask(
    slug,
    projectId,
    task.id
  );
  const [newComment, setNewComment] = useState("");

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await postComment(newComment.trim());
    setNewComment("");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task? This can't be undone.")) return;
    await deleteTask();
    onDeleted(task.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="h-full w-full max-w-xl overflow-y-auto bg-[#f7f7f4] p-5 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <Badge tone="purple">Task detail</Badge>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
            <button onClick={onClose} className="rounded-lg p-2 hover:bg-black/5">
              <X size={18} />
            </button>
          </div>
        </div>

        <h2 className="mt-7 text-3xl font-bold">{task.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#777]">
          {task.description || "No description yet."}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {[
            ["Status", columnName],
            ["Priority", task.priority],
            ["Assignee", task.assignee?.name ?? "Unassigned"],
            ["Due date", formatDueDate(task.dueDate)],
          ].map((x) => (
            <Card className="p-4" key={x[0]}>
              <p className="text-[10px] uppercase tracking-widest text-[#999]">{x[0]}</p>
              <p className="mt-2 text-sm font-semibold">{x[1]}</p>
            </Card>
          ))}
        </div>

        <div className="mt-7">
          <h3 className="font-bold">Comments</h3>

          {loadingComments ? (
            <p className="mt-4 text-xs text-[#999]">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="mt-4 text-xs text-[#999]">No comments yet — be the first.</p>
          ) : (
            comments.map((c) => (
              <div className="mt-4 flex gap-3" key={c.id}>
                <Avatar name={c.user.name} />
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs font-semibold">{c.user.name}</p>
                  <p className="mt-1 text-xs leading-5 text-[#777]">{c.content}</p>
                </div>
              </div>
            ))
          )}

          <form onSubmit={handlePostComment} className="mt-5 flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="h-10 flex-1 rounded-xl border border-black/10 bg-white px-3 text-xs outline-none focus:border-nexus/40"
            />
            <Button type="submit" className="px-4 py-2 text-xs" disabled={!newComment.trim() || posting}>
              {posting ? "..." : "Post"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}