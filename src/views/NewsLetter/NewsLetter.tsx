import { useEffect, useState } from "react";
import axios from "axios";
import {
  Eye,
  Power,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import CardBox from "../../components/shared/CardBox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Newsletter = () => {
  const navigate = useNavigate();

  const [subscribers, setSubscribers] =
    useState<Subscriber[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState<string | null>(null);

  // =========================================================
  // FETCH SUBSCRIBERS
  // =========================================================

  const fetchSubscribers = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "adminToken"
        );

      if (!token) {
        toast.error(
          "Admin authentication required"
        );
        return;
      }

      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/newsletter/admin`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setSubscribers(
        response.data?.subscribers || []
      );
    } catch (error: unknown) {
      console.error(
        "Fetch newsletter subscribers error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch subscribers";

      toast.error(
        message ||
          "Failed to fetch subscribers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // =========================================================
  // TOGGLE STATUS
  // =========================================================

  const toggleStatus = async (
    subscriber: Subscriber
  ) => {
    try {
      setUpdating(
        subscriber._id
      );

      const token =
        localStorage.getItem(
          "adminToken"
        );

      if (!token) {
        toast.error(
          "Admin authentication required"
        );
        return;
      }

      const response =
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/newsletter/admin/${subscriber._id}/toggle-status`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      toast.success(
        response.data?.message ||
          "Subscriber status updated"
      );

      setSubscribers((prev) =>
        prev.map((item) =>
          item._id === subscriber._id
            ? {
                ...item,
                isActive:
                  !item.isActive,
              }
            : item
        )
      );
    } catch (error: unknown) {
      console.error(
        "Toggle subscriber status error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to update subscriber";

      toast.error(
        message ||
          "Failed to update subscriber"
      );
    } finally {
      setUpdating(null);
    }
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <CardBox>
        <div className="py-12 text-center text-gray-500">
          Loading subscribers...
        </div>
      </CardBox>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h2 className="text-2xl font-semibold">
          Newsletter
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage newsletter subscribers
        </p>

      </div>


      {/* DESKTOP */}

      <div className="hidden md:block">

        <CardBox className="overflow-hidden p-0">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Email
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Subscribed Date
                </TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {subscribers.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-gray-500"
                  >
                    No newsletter subscribers found
                  </TableCell>

                </TableRow>

              ) : (

                subscribers.map(
                  (subscriber) => (

                    <TableRow
                      key={
                        subscriber._id
                      }
                    >

                      {/* EMAIL */}

                      <TableCell>

                        <p className="font-medium">
                          {subscriber.email}
                        </p>

                      </TableCell>


                      {/* STATUS */}

                      <TableCell>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            subscriber.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {subscriber.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </TableCell>


                      {/* DATE */}

                      <TableCell>

                        {formatDate(
                          subscriber.subscribedAt
                        )}

                      </TableCell>


                      {/* ACTIONS */}

                      <TableCell>

                        <div className="flex justify-end gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/newsletter/${subscriber._id}`
                              )
                            }
                            className="rounded-md border border-gray-300 p-2 hover:bg-gray-50"
                            title="View"
                          >
                            <Eye
                              size={16}
                            />
                          </button>


                          {/* TOGGLE */}

                          <button
                            type="button"
                            disabled={
                              updating ===
                              subscriber._id
                            }
                            onClick={() =>
                              toggleStatus(
                                subscriber
                              )
                            }
                            className={`rounded-md border p-2 disabled:opacity-50 ${
                              subscriber.isActive
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                            title={
                              subscriber.isActive
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            <Power
                              size={16}
                            />
                          </button>

                        </div>

                      </TableCell>

                    </TableRow>

                  )
                )

              )}

            </TableBody>

          </Table>

        </CardBox>

      </div>


      {/* MOBILE */}

      <div className="space-y-4 md:hidden">

        {subscribers.length === 0 ? (

          <CardBox>

            <div className="py-8 text-center text-gray-500">
              No newsletter subscribers found
            </div>

          </CardBox>

        ) : (

          subscribers.map(
            (subscriber) => (

              <CardBox
                key={
                  subscriber._id
                }
              >

                {/* EMAIL + STATUS */}

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <p className="break-all font-semibold">
                      {subscriber.email}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Subscribed:{" "}
                      {formatDate(
                        subscriber.subscribedAt
                      )}
                    </p>

                  </div>


                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      subscriber.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {subscriber.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>


                {/* ACTIONS */}

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/newsletter/${subscriber._id}`
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium"
                  >
                    <Eye
                      size={15}
                    />
                    View
                  </button>


                  <button
                    type="button"
                    disabled={
                      updating ===
                      subscriber._id
                    }
                    onClick={() =>
                      toggleStatus(
                        subscriber
                      )
                    }
                    className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                      subscriber.isActive
                        ? "border-red-200 text-red-600"
                        : "border-green-200 text-green-600"
                    }`}
                  >
                    <Power
                      size={15}
                    />

                    {subscriber.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                </div>

              </CardBox>

            )
          )

        )}

      </div>

    </div>
  );
};

export default Newsletter;