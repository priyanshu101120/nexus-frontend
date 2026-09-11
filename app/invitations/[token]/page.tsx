"use client";

import { useEffect, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { invitationApi, notificationApi } from "@/lib/api";
import type { Notification } from "@/hooks/type";

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
      console.error("Failed to load notifications:", error);
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
      toast.error("Invitation link is invalid");
      return;
    }

    try {
      setActionLoading(notification.id);

      const result = await invitationApi.accept(token);

      await notificationApi.markAsRead(notification.id);

      toast.success("Invitation accepted!");

      setNotifications((prev) =>
        prev.filter((item) => item.id !== notification.id),
      );

      if (result.workspace?.slug) {
        router.push(
          `/workspace/${result.workspace.slug}/overview`,
        );
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

  const handleDecline = async (notification: Notification) => {
    try {
      setActionLoading(notification.id);

      /*
       * Abhi backend mein decline endpoint nahi hai.
       * Isliye currently notification ko read kar rahe hain.
       *
       * Jab decline API banayenge:
       * await invitationApi.decline(notification.invitation!.token);
       */

      await notificationApi.markAsRead(notification.id);

      setNotifications((prev) =>
        prev.filter((item) => item.id !== notification.id),
      );

      toast.success("Invitation declined");
    } catch (error) {
      console.error(error);
      toast.error("Failed to decline invitation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        })),
      );

      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#111]">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#6d5dfb]">
              Updates
            </p>

            <h1 className="text-2xl font-semibold tracking-tight">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-black/45">
              Stay updated with your invitations and workspace activity.
            </p>
          </div>

          {notifications.some(
            (notification) => !notification.read,
          ) && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-sm font-medium text-black/50 transition hover:text-black"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-black/[0.07] bg-white px-6 py-16 text-center">
            <p className="text-sm text-black/40">
              Loading notifications...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-black/[0.07] bg-white px-6 py-20 text-center">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-black/[0.04]">
              <Bell size={20} className="text-black/40" />
            </div>

            <h2 className="font-medium">
              You're all caught up
            </h2>

            <p className="mt-1 text-sm text-black/40">
              You don't have any new notifications.
            </p>
          </div>
        )}

        {/* Notifications */}
        {!loading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const invitation = notification.invitation;

              const isInvitation =
                notification.type === "INVITATION" &&
                invitation &&
                !invitation.accepted;

              return (
                <div
                  key={notification.id}
                  className={`rounded-2xl border bg-white p-5 transition ${
                    notification.read
                      ? "border-black/[0.06]"
                      : "border-[#6d5dfb]/20 bg-[#6d5dfb]/[0.02]"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        notification.read
                          ? "bg-black/[0.04]"
                          : "bg-[#6d5dfb]/10"
                      }`}
                    >
                      <Bell
                        size={18}
                        className={
                          notification.read
                            ? "text-black/40"
                            : "text-[#6d5dfb]"
                        }
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                            className={`text-sm ${
                              notification.read
                                ? "font-medium"
                                : "font-semibold"
                            }`}
                          >
                            {notification.message}
                          </p>

                          <p className="mt-1 text-xs text-black/40">
                            {new Date(
                              notification.createdAt,
                            ).toLocaleString()}
                          </p>
                        </div>

                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#6d5dfb]" />
                        )}
                      </div>

                      {/* Invitation */}
                      {isInvitation && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleAccept(notification)
                            }
                            disabled={
                              actionLoading === notification.id
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-[#111] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Check size={15} />

                            {actionLoading === notification.id
                              ? "Accepting..."
                              : "Accept"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDecline(notification)
                            }
                            disabled={
                              actionLoading === notification.id
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2.5 text-sm font-medium transition hover:bg-black/[0.03] disabled:opacity-50"
                          >
                            <X size={15} />

                            Decline
                          </button>
                        </div>
                      )}

                      {/* Normal notification */}
                      {!isInvitation && !notification.read && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkRead(notification.id)
                          }
                          className="mt-3 text-xs font-medium text-black/40 hover:text-black"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}