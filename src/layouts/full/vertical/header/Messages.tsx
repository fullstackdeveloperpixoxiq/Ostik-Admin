"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Link, useNavigate } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";

interface AdminNotification {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  time: string;
  href: string;
  icon: string;
  color: string;
  bgcolor: string;
}

const Messages = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<
    AdminNotification[]
  >([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // =========================================================
  // FETCH NOTIFICATIONS
  // =========================================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/admin/notification`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const notificationData =
        response.data?.notifications || [];

      const count =
        response.data?.count ??
        notificationData.length;

      setNotifications(notificationData);
      setUnreadCount(count);
    } catch (error) {
      console.error(
        "Notification fetch error:",
        error
      );

      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================================================
  // REFRESH WHEN DROPDOWN OPENS
  // =========================================================

  const handleDropdownChange = (open: boolean) => {
    if (open) {
      fetchNotifications();
    }
  };

  // =========================================================
  // MARK NOTIFICATION AS READ
  // =========================================================

  const handleNotificationClick = async (
    notification: AdminNotification
  ) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/ostik-admin/login");
      return;
    }

    // Remove immediately from UI
    setNotifications((prev) =>
      prev.filter(
        (item) => item.id !== notification.id
      )
    );

    // Decrease unread count immediately
    setUnreadCount((prev) =>
      Math.max(prev - 1, 0)
    );

    try {
      await axios.post(
        `${API_URL}/api/admin/notification/${encodeURIComponent(
          notification.id
        )}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error
      );

      // Restore notification if API failed
      setNotifications((prev) => [
        notification,
        ...prev,
      ]);

      setUnreadCount((prev) => prev + 1);

      return;
    }

    // Navigate after marking as read
    navigate(notification.href);
  };

  // =========================================================
  // TIME FORMAT
  // =========================================================

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    const now = new Date();

    const diff =
      now.getTime() -
      date.getTime();

    const minutes = Math.floor(
      diff / 60000
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days} day${
        days > 1 ? "s" : ""
      } ago`;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  return (
    <div className="relative group/menu px-4 sm:px-15">

      <DropdownMenu
        onOpenChange={handleDropdownChange}
      >

        {/* ===================================================
            BELL
        ==================================================== */}

        <DropdownMenuTrigger asChild>

          <div className="relative">

            <span className="relative after:absolute after:w-10 after:h-10 after:rounded-full hover:text-primary after:-top-1/2 hover:after:bg-lightprimary text-foreground dark:text-muted-foreground rounded-full flex justify-center items-center cursor-pointer group-hover/menu:after:bg-lightprimary group-hover/menu:!text-primary">

              <Icon
                icon="tabler:bell-ringing"
                height={20}
              />

            </span>

            {/* UNREAD DOT */}

            {unreadCount > 0 && (
              <span className="rounded-full absolute -end-[6px] -top-[5px] text-[10px] h-2 w-2 bg-primary flex justify-center items-center" />
            )}

          </div>

        </DropdownMenuTrigger>


        {/* ===================================================
            DROPDOWN
        ==================================================== */}

        <DropdownMenuContent
          align="end"
          className="w-screen sm:w-[350px] py-6 rounded-sm border border-ld"
        >

          {/* HEADER */}

          <div className="flex items-center px-6 justify-between">

            <div>

              <h3 className="mb-0 text-lg font-semibold text-ld">
                Notifications
              </h3>

              <p className="text-xs text-muted-foreground mt-1">
                Recent activity
              </p>

            </div>

            {/* UNREAD COUNT */}

            {unreadCount > 0 && (
              <Badge color="primary">
                {unreadCount}
              </Badge>
            )}

          </div>


          {/* =================================================
              NOTIFICATIONS
          ================================================== */}

          <SimpleBar className="max-h-80 mt-3">

            {loading ? (

              <div className="px-6 py-8 text-center">

                <p className="text-sm text-muted-foreground">
                  Loading notifications...
                </p>

              </div>

            ) : notifications.length === 0 ? (

              <div className="px-6 py-10 text-center">

                <Icon
                  icon="solar:bell-off-line-duotone"
                  className="mx-auto text-3xl text-muted-foreground"
                />

                <p className="mt-3 text-sm font-medium">
                  No recent notifications
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  You're all caught up.
                </p>

              </div>

            ) : (

              notifications.map(
                (notification) => (

                  <DropdownMenuItem
                    key={notification.id}
                    className="px-6 py-3 flex items-center bg-hover group/link w-full cursor-pointer"
                    onSelect={() => {
                      handleNotificationClick(
                        notification
                      );
                    }}
                  >

                    <div className="flex items-center gap-3 w-full">

                      {/* ICON */}

                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.bgcolor}`}
                      >

                        <Icon
                          icon={
                            notification.icon
                          }
                          className={`text-lg ${notification.color}`}
                        />

                      </span>


                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <h5 className="mb-1 text-sm font-semibold group-hover/link:text-primary">
                          {notification.title}
                        </h5>

                        <span className="text-xs block truncate text-muted-foreground">
                          {notification.subtitle}
                        </span>

                        <span className="text-[11px] block mt-1 text-muted-foreground">
                          {formatTime(
                            notification.time
                          )}
                        </span>

                      </div>

                    </div>

                  </DropdownMenuItem>

                )
              )

            )}

          </SimpleBar>


          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="pt-5 px-6">

            <Link
              to="/ostik-admin/notifications"
              className="block"
            >

              <Button
                variant="outline"
                className="w-full"
              >
                See All Notifications
              </Button>

            </Link>

          </div>

        </DropdownMenuContent>

      </DropdownMenu>

    </div>
  );
};

export default Messages;