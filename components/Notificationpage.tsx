"use client";

import { useEffect, useState } from "react";
import { Check, Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { notificationApi, invitationApi } from "@/lib/api";
import type { Notification } from "@/hooks/type";
import { toast } from "sonner";

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data = await notificationApi.list();

      setNotifications(data.notifications ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleAccept = async (notification: Notification) => {
    const token = notification.invitation?.token;

    if (!token) {
      toast.error("Invalid invitation");
      return;
    }

    try {
      setActionLoading(notification.id);

      await invitationApi.accept(token);

      await notificationApi.markAsRead(notification.id);

      toast.success("Invitation accepted");

      setNotifications((prev) =>
        prev.filter((item) => item.id !== notification.id),
      );

      const workspaceSlug =
        notification.invitation?.workspace.slug;

      if (workspaceSlug) {
        router.push(`/workspace/${workspaceSlug}/overview`);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to accept invitation";

      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRead = async (notification: Notification) => {
    try {
      await notificationApi.markAsRead(notification.id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item,
        ),
      );
    } catch {
      toast.error("Failed to update notification");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-black/40">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Notifications
        </h1>

        <p className="mt-1 text-sm text-black/45">
          Stay updated with your workspace activity.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white py-20 text-center">
          <div className="mb-4 rounded-full bg-black/[0.04] p-4">
            <Bell className="h-6 w-6 text-black/40" />
          </div>

          <h2 className="font-medium">
            No notifications
          </h2>

          <p className="mt-1 text-sm text-black/40">
            You're all caught up.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const invitation = notification.invitation;

            return (
              <div
                key={notification.id}
                className={`rounded-2xl border p-5 transition ${
                  notification.read
                    ? "border-black/5 bg-white"
                    : "border-[#6d5dfb]/20 bg-[#6d5dfb]/[0.03]"
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6d5dfb]/10">
                    <Bell className="h-5 w-5 text-[#6d5dfb]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {notification.message}
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      {new Date(
                        notification.createdAt,
                      ).toLocaleString()}
                    </p>

                    {notification.type === "INVITATION" &&
                      invitation &&
                      !invitation.accepted && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              handleAccept(notification)
                            }
                            disabled={
                              actionLoading === notification.id
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-[#6d5dfb] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                          >
                            <Check className="h-4 w-4" />

                            {actionLoading === notification.id
                              ? "Accepting..."
                              : "Accept"}
                          </button>

                          <button
                            onClick={() =>
                              handleRead(notification)
                            }
                            disabled={
                              actionLoading === notification.id
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-black/[0.03]"
                          >
                            <X className="h-4 w-4" />

                            Decline
                          </button>
                        </div>
                      )}
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => handleRead(notification)}
                      className="text-xs text-black/40 hover:text-black"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}