import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Power } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const NewsletterDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [subscriber, setSubscriber] =
    useState<Subscriber | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  // =========================================================
  // FETCH SUBSCRIBER
  // =========================================================

  const fetchSubscriber = async () => {
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
          "Subscriber ID is missing"
        );
        return;
      }

      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/newsletter/admin/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setSubscriber(
        response.data?.subscriber ||
          null
      );
    } catch (error: unknown) {
      console.error(
        "Fetch subscriber error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch subscriber";

      toast.error(
        message ||
          "Failed to fetch subscriber"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriber();
  }, [id]);

  // =========================================================
  // TOGGLE STATUS
  // =========================================================

  const handleToggleStatus = async () => {
    if (!subscriber) return;

    try {
      setUpdating(true);

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

      setSubscriber({
        ...subscriber,
        isActive:
          !subscriber.isActive,
      });
    } catch (error: unknown) {
      console.error(
        "Toggle status error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to update status";

      toast.error(
        message ||
          "Failed to update status"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDateTime = (
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
          Loading subscriber...
        </div>
      </CardBox>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!subscriber) {
    return (
      <CardBox>

        <div className="py-12 text-center">

          <p className="mb-4 text-gray-500">
            Subscriber not found
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/newsletter"
              )
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Back to Newsletter
          </button>

        </div>

      </CardBox>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/newsletter"
            )
          }
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={16} />

          Back to Newsletter
        </button>


        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-semibold">
              Newsletter Subscriber
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View subscriber information
            </p>

          </div>


          <button
            type="button"
            disabled={updating}
            onClick={
              handleToggleStatus
            }
            className={`flex w-fit items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
              subscriber.isActive
                ? "bg-red-600"
                : "bg-primary"
            }`}
          >
            <Power size={15} />

            {updating
              ? "Updating..."
              : subscriber.isActive
              ? "Deactivate"
              : "Activate"}

          </button>

        </div>

      </div>


      {/* SUBSCRIBER */}

      <CardBox>

        <h5 className="mb-5 text-lg font-semibold">
          Subscriber Information
        </h5>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

          {/* EMAIL */}

          <div>

            <p className="mb-1 text-sm text-gray-500">
              Email
            </p>

            <p className="break-all font-medium">
              {subscriber.email}
            </p>

          </div>


          {/* STATUS */}

          <div>

            <p className="mb-1 text-sm text-gray-500">
              Status
            </p>

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

          </div>


          {/* SUBSCRIBED */}

          <div>

            <p className="mb-1 text-sm text-gray-500">
              Subscribed At
            </p>

            <p className="font-medium">
              {formatDateTime(
                subscriber.subscribedAt
              )}
            </p>

          </div>


          {/* CREATED */}

          <div>

            <p className="mb-1 text-sm text-gray-500">
              Created At
            </p>

            <p className="font-medium">
              {formatDateTime(
                subscriber.createdAt
              )}
            </p>

          </div>


          {/* UPDATED */}

          <div>

            <p className="mb-1 text-sm text-gray-500">
              Last Updated
            </p>

            <p className="font-medium">
              {formatDateTime(
                subscriber.updatedAt
              )}
            </p>

          </div>


          {/* ID */}

          <div>

            <p className="mb-1 text-sm text-gray-500">
              Subscriber ID
            </p>

            <p className="break-all font-medium">
              {subscriber._id}
            </p>

          </div>

        </div>

      </CardBox>

    </div>
  );
};

export default NewsletterDetails;