import { useEffect, useState } from "react";
import axios from "axios";
import {
  Eye,
  Trash2,
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

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status:
    | "unread"
    | "read"
    | "replied";
  createdAt?: string;
}

const Contacts = () => {

  const navigate = useNavigate();

  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [deleting, setDeleting] =
    useState<string | null>(null);


  // =========================================================
  // FETCH MESSAGES
  // =========================================================

  const fetchMessages = async () => {
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
          `${import.meta.env.VITE_API_URL}/api/contact/admin`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      setMessages(
        response.data?.messages || []
      );

    } catch (error: unknown) {

      console.error(
        "Fetch contact messages error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch messages";

      toast.error(
        message ||
          "Failed to fetch messages"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchMessages();
  }, []);


  // =========================================================
  // DELETE
  // =========================================================

  const deleteMessage = async (
    id: string
  ) => {

    try {

      setDeleting(id);

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
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/contact/admin/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      toast.success(
        response.data?.message ||
          "Message deleted successfully"
      );


      setMessages((prev) =>
        prev.filter(
          (item) =>
            item._id !== id
        )
      );

    } catch (error: unknown) {

      console.error(
        "Delete contact error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to delete message";

      toast.error(
        message ||
          "Failed to delete message"
      );

    } finally {

      setDeleting(null);

    }
  };


  // =========================================================
  // DELETE CONFIRMATION
  // =========================================================

  const handleDelete = (
    id: string
  ) => {

    toast(
      "Are you sure you want to delete this message?",
      {
        action: {
          label: "Delete",
          onClick: () =>
            deleteMessage(id),
        },

        cancel: {
          label: "Cancel",
          onClick: () => {},
        },

        duration: 8000,
      }
    );
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
  // STATUS
  // =========================================================

  const getStatusClass = (
    status: ContactMessage["status"]
  ) => {

    switch (status) {

      case "unread":
        return "bg-red-100 text-red-700";

      case "read":
        return "bg-yellow-100 text-yellow-700";

      case "replied":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <CardBox>

        <div className="py-12 text-center text-gray-500">
          Loading contact messages...
        </div>

      </CardBox>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h2 className="text-2xl font-semibold">
          Contact Messages
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer enquiries and support messages
        </p>

      </div>


      {/* DESKTOP */}

      <div className="hidden md:block">

        <CardBox className="overflow-hidden p-0">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Customer
                </TableHead>

                <TableHead>
                  Subject
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Date
                </TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {messages.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-gray-500"
                  >
                    No contact messages found
                  </TableCell>

                </TableRow>

              ) : (

                messages.map(
                  (item) => (

                    <TableRow
                      key={item._id}
                    >

                      {/* CUSTOMER */}

                      <TableCell>

                        <div>

                          <p className="font-medium">
                            {item.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item.email}
                          </p>

                        </div>

                      </TableCell>


                      {/* SUBJECT */}

                      <TableCell>

                        <p className="max-w-[260px] truncate font-medium">
                          {item.subject}
                        </p>

                        <p className="mt-1 max-w-[260px] truncate text-xs text-gray-500">
                          {item.message}
                        </p>

                      </TableCell>


                      {/* STATUS */}

                      <TableCell>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status
                            .charAt(0)
                            .toUpperCase() +
                            item.status.slice(1)}
                        </span>

                      </TableCell>


                      {/* DATE */}

                      <TableCell>

                        {formatDate(
                          item.createdAt
                        )}

                      </TableCell>


                      {/* ACTIONS */}

                      <TableCell>

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/contacts/${item._id}`
                              )
                            }
                            className="rounded-md border border-gray-300 p-2 hover:bg-gray-50"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>


                          <button
                            type="button"
                            disabled={
                              deleting ===
                              item._id
                            }
                            onClick={() =>
                              handleDelete(
                                item._id
                              )
                            }
                            className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
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

        {messages.length === 0 ? (

          <CardBox>

            <div className="py-8 text-center text-gray-500">
              No contact messages found
            </div>

          </CardBox>

        ) : (

          messages.map(
            (item) => (

              <CardBox
                key={item._id}
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="mt-1 break-all text-xs text-gray-500">
                      {item.email}
                    </p>

                  </div>


                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status
                      .charAt(0)
                      .toUpperCase() +
                      item.status.slice(1)}
                  </span>

                </div>


                <div className="mt-4 border-t border-gray-100 pt-4">

                  <p className="font-medium">
                    {item.subject}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {item.message}
                  </p>

                </div>


                <div className="mt-4 flex items-center justify-between">

                  <p className="text-xs text-gray-500">
                    {formatDate(
                      item.createdAt
                    )}
                  </p>


                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/contacts/${item._id}`
                        )
                      }
                      className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <Eye size={15} />
                      View
                    </button>


                    <button
                      type="button"
                      disabled={
                        deleting ===
                        item._id
                      }
                      onClick={() =>
                        handleDelete(
                          item._id
                        )
                      }
                      className="rounded-md border border-red-200 px-3 py-2 text-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                </div>

              </CardBox>

            )
          )

        )}

      </div>

    </div>
  );
};

export default Contacts;