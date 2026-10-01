import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useNavigate,
  useParams,
} from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Reply {
  _id?: string;

  message: string;

  repliedAt?: string;

  repliedBy?: {
    _id?: string;
    name?: string;
    email?: string;
  };
}

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

  replies?: Reply[];

  createdAt?: string;

  updatedAt?: string;
}

const ContactDetails = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const [contact, setContact] =
    useState<ContactMessage | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [reply, setReply] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  // =========================================================
  // FETCH MESSAGE
  // =========================================================

  const fetchMessage = async () => {

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

      if (!id) {

        toast.error(
          "Message ID is missing"
        );

        return;
      }


      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/contact/admin/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      setContact(
        response.data?.contact ||
          null
      );

    } catch (error: unknown) {

      console.error(
        "Fetch contact detail error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch message";

      toast.error(
        message ||
          "Failed to fetch message"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchMessage();
  }, [id]);


  // =========================================================
  // SEND REPLY
  // =========================================================

  const handleReply = async () => {

    if (!contact) return;

    if (!reply.trim()) {

      toast.error(
        "Please enter a reply"
      );

      return;
    }


    try {

      setSending(true);

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
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/contact/admin/${contact._id}/reply`,
          {
            message:
              reply.trim(),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      toast.success(
        response.data?.message ||
          "Reply sent successfully"
      );


      setContact(
        response.data?.contact ||
          contact
      );

      setReply("");

    } catch (error: unknown) {

      console.error(
        "Send reply error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to send reply";

      toast.error(
        message ||
          "Failed to send reply"
      );

    } finally {

      setSending(false);

    }
  };


  // =========================================================
  // DELETE
  // =========================================================

  const deleteMessage = async () => {

    if (!contact) return;

    try {

      setDeleting(true);

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
          `${import.meta.env.VITE_API_URL}/api/contact/admin/${contact._id}`,
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


      navigate(
        "/contacts"
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

      setDeleting(false);

    }
  };


  // =========================================================
  // DELETE CONFIRMATION
  // =========================================================

  const handleDelete = () => {

    toast(
      "Are you sure you want to delete this message?",
      {
        action: {
          label: "Delete",
          onClick:
            deleteMessage,
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
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
          Loading message...
        </div>

      </CardBox>
    );
  }


  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!contact) {

    return (
      <CardBox>

        <div className="py-12 text-center">

          <p className="mb-4 text-gray-500">
            Contact message not found
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/contacts"
              )
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Back to Contacts
          </button>

        </div>

      </CardBox>
    );
  }


  return (
    <div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/contacts"
            )
          }
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          Back to Contacts
        </button>


        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-semibold">
              Contact Message
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View customer enquiry and reply
            </p>

          </div>


          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="flex w-fit items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            <Trash2 size={15} />

            {deleting
              ? "Deleting..."
              : "Delete"}
          </button>

        </div>

      </div>


      {/* =====================================================
          TOP INFORMATION
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* CUSTOMER */}

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Customer
          </h5>

          <div className="space-y-4">

            <div>

              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1 font-medium">
                {contact.name}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 break-all font-medium">
                {contact.email}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 font-medium">
                {contact.phone ||
                  "-"}
              </p>

            </div>

          </div>

        </CardBox>


        {/* STATUS */}

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Message Status
          </h5>

          <div className="space-y-4">

            <div>

              <p className="mb-2 text-sm text-gray-500">
                Current Status
              </p>

              <select
                value={contact.status}
                onChange={async (e) => {

                  try {

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
                        `${import.meta.env.VITE_API_URL}/api/contact/admin/${contact._id}/status`,
                        {
                          status:
                            e.target.value,
                        },
                        {
                          headers: {
                            Authorization:
                              `Bearer ${token}`,
                          },
                        }
                      );

                    toast.success(
                      response.data?.message ||
                        "Status updated"
                    );

                    setContact(
                      response.data?.contact ||
                        contact
                    );

                  } catch (
                    error: unknown
                  ) {

                    const message =
                      axios.isAxiosError(
                        error
                      )
                        ? error.response?.data?.message
                        : "Failed to update status";

                    toast.error(
                      message ||
                        "Failed to update status"
                    );
                  }

                }}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              >

                <option value="unread">
                  Unread
                </option>

                <option value="read">
                  Read
                </option>

                <option value="replied">
                  Replied
                </option>

              </select>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Received
              </p>

              <p className="mt-1 font-medium">
                {formatDate(
                  contact.createdAt
                )}
              </p>

            </div>

          </div>

        </CardBox>


        {/* SUBJECT */}

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Subject
          </h5>

          <p className="font-medium leading-6">
            {contact.subject}
          </p>

        </CardBox>

      </div>


      {/* =====================================================
          CUSTOMER MESSAGE
      ====================================================== */}

      <div className="mt-6">

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Customer Message
          </h5>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">

            <p className="whitespace-pre-wrap leading-7 text-gray-700">
              {contact.message}
            </p>

          </div>

        </CardBox>

      </div>


      {/* =====================================================
          REPLY HISTORY
      ====================================================== */}

      {contact.replies &&
        contact.replies.length > 0 && (

        <div className="mt-6">

          <CardBox>

            <h5 className="mb-5 text-lg font-semibold">
              Reply History
            </h5>

            <div className="space-y-4">

              {contact.replies.map(
                (item, index) => (

                  <div
                    key={
                      item._id ||
                      index
                    }
                    className="rounded-lg border border-gray-200 p-4"
                  >

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="font-medium">
                          {item.repliedBy
                            ?.name ||
                            "Ostik Admin"}
                        </p>

                        {item.repliedBy
                          ?.email && (
                          <p className="text-xs text-gray-500">
                            {
                              item.repliedBy
                                .email
                            }
                          </p>
                        )}

                      </div>


                      <p className="text-xs text-gray-500">
                        {formatDate(
                          item.repliedAt
                        )}
                      </p>

                    </div>


                    <p className="mt-3 whitespace-pre-wrap leading-6 text-gray-700">
                      {item.message}
                    </p>

                  </div>

                )
              )}

            </div>

          </CardBox>

        </div>

      )}


      {/* =====================================================
          REPLY
      ====================================================== */}

      <div className="mt-6">

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Reply to Customer
          </h5>

          <textarea
            value={reply}
            onChange={(e) =>
              setReply(
                e.target.value
              )
            }
            rows={7}
            placeholder="Write your reply to the customer..."
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
          />


          <div className="mt-4 flex justify-end">

            <button
              type="button"
              disabled={
                sending ||
                !reply.trim()
              }
              onClick={
                handleReply
              }
              className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Send size={16} />

              {sending
                ? "Sending..."
                : "Send Reply"}

            </button>

          </div>

        </CardBox>

      </div>

    </div>
  );
};

export default ContactDetails;