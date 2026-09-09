import { useCallback, useEffect, useState } from "react";
import { commentApi, taskApi } from "@/lib/api";
import { Comment, UpdateTaskInput } from "./type";

const useTask = (slug: string, projectId: string, taskId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      setLoadingComments(true);
      setError(null);
      const data = await commentApi.list(slug, projectId, taskId);
      setComments(data.comments ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  }, [slug, projectId, taskId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const postComment = async (content: string) => {
    try {
      setPosting(true);
      const data = await commentApi.create(slug, projectId, taskId, { content });
      setComments((prev) => [...prev, data.comment]);
      return data.comment;
    } finally {
      setPosting(false);
    }
  };

  const removeComment = async (commentId: string) => {
    await commentApi.remove(slug, projectId, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const updateTask = async (payload: UpdateTaskInput) => {
    const data = await taskApi.update(slug, projectId, taskId, payload);
    return data.task;
  };

  const deleteTask = async () => {
    try {
      setDeleting(true);
      await taskApi.remove(slug, projectId, taskId);
    } finally {
      setDeleting(false);
    }
  };

  return {
    comments,
    loadingComments,
    posting,
    deleting,
    error,
    postComment,
    removeComment,
    updateTask,
    deleteTask,
    refresh: loadComments,
  };
};

export default useTask;