import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type ReturnStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Picked Up"
  | "Received"
  | "Refunded"
  | "Cancelled";

interface ReturnItem {
  orderItemId?: string;
  productId?: string;
  variantId?: string | null;
  name?: string;
  variantName?: string;
  sku?: string;
  image?: string;
  quantity?: number;
  price?: number;
  finalPrice?: number;
}

interface ReturnUser {
  _id?: string;
  name?: string;
  email?: string;
}

interface ReturnOrder {
  _id?: string;
  total?: number;
  orderStatus?: string;
  placedAt?: string;
}

interface ReturnRequest {
  _id: string;
  user?: ReturnUser;
  order?: ReturnOrder;
  item?: ReturnItem;
  reason: string;
  comment?: string;
  status: ReturnStatus;
  requestedAt?: string;
  approvedAt?: string | null;
  completedAt?: string | null;
  adminComment?: string;
  createdAt?: string;
}

const ReturnDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [returnRequest, setReturnRequest] =
    useState<ReturnRequest | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState<ReturnStatus>("Pending");

  const [adminComment, setAdminComment] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // =========================================================
  // FETCH RETURN DETAILS
  // =========================================================

  const fetchReturnDetails = async () => {
    try {
      setLoading(true);

      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        toast.error("Admin authentication required");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/return/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = response.data?.returnRequest;

      setReturnRequest(data);
      setSelectedStatus(data?.status || "Pending");
      setAdminComment(data?.adminComment || "");
    } catch (error: any) {
      console.error("Error fetching return details:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load return details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReturnDetails();
    }
  }, [id]);

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const handleUpdateStatus = async () => {
    if (!returnRequest) return;

    try {
      setUpdating(true);

      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        toast.error("Admin authentication required");
        return;
      }

      await axios.put(
        `${API_URL}/api/return/admin/${returnRequest._id}/status`,
        {
          status: selectedStatus,
          adminComment,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success("Return status updated successfully");

      await fetchReturnDetails();
    } catch (error: any) {
      console.error("Error updating return:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update return status"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================
  const formatDateTime = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status?: ReturnStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Approved":
        return "bg-blue-100 text-blue-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Picked Up":
        return "bg-purple-100 text-purple-700";

      case "Received":
        return "bg-indigo-100 text-indigo-700";

      case "Refunded":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw
              size={18}
              className="animate-spin"
            />
            Loading return details...
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!returnRequest) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border border-gray-100 bg-white p-10 text-center">
          <p className="text-gray-500">
            Return request not found.
          </p>

          <button
            onClick={() =>
              navigate("/ostik-admin/returns")
            }
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Returns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6">

        <button
          onClick={() =>
            navigate("/ostik-admin/returns")
          }
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to Returns
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Return Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Return #
              {returnRequest._id
                .slice(-8)
                .toUpperCase()}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${getStatusClass(
              returnRequest.status
            )}`}
          >
            {returnRequest.status}
          </span>

        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <div className="space-y-5 xl:col-span-2">

          {/* PRODUCT */}
          <div className="rounded-xl border border-gray-100 bg-white">

            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-gray-800">
                Product Details
              </h2>
            </div>

            <div className="p-5">

              <div className="flex flex-col gap-5 sm:flex-row">

                {/* Image */}
                {returnRequest.item?.image ? (
                  <img
                    src={returnRequest.item.image}
                    alt={
                      returnRequest.item.name ||
                      "Product"
                    }
                    className="h-28 w-28 rounded-xl border border-gray-100 object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                    No Image
                  </div>
                )}

                {/* Product information */}
                <div className="flex-1">

                  <h3 className="text-lg font-semibold text-gray-800">
                    {returnRequest.item?.name ||
                      "-"}
                  </h3>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <div>
                      <p className="text-xs text-gray-400">
                        Variant
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {returnRequest.item
                          ?.variantName || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        SKU
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {returnRequest.item?.sku ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Quantity
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {returnRequest.item
                          ?.quantity || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Item Price
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        ₹
                        {(
                          returnRequest.item
                            ?.finalPrice || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* RETURN REASON */}
          <div className="rounded-xl border border-gray-100 bg-white">

            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-gray-800">
                Return Request
              </h2>
            </div>

            <div className="space-y-5 p-5">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Reason
                </p>

                <p className="mt-2 text-sm text-gray-700">
                  {returnRequest.reason ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Customer Comment
                </p>

                <div className="mt-2 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm leading-6 text-gray-700">
                    {returnRequest.comment ||
                      "No comment provided."}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* ORDER INFORMATION */}
          <div className="rounded-xl border border-gray-100 bg-white">

            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-gray-800">
                Order Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3">

              <div>
                <p className="text-xs text-gray-400">
                  Order ID
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  #
                  {returnRequest.order?._id
                    ?.slice(-8)
                    .toUpperCase() || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Order Status
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {returnRequest.order
                    ?.orderStatus || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Order Total
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  ₹
                  {(
                    returnRequest.order
                      ?.total || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            RIGHT SIDEBAR
        =================================================== */}

        <div className="space-y-5">

          {/* CUSTOMER */}
          <div className="rounded-xl border border-gray-100 bg-white">

            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <User
                  size={18}
                  className="text-gray-500"
                />

                <h2 className="font-semibold text-gray-800">
                  Customer
                </h2>
              </div>
            </div>

            <div className="p-5">

              <p className="font-medium text-gray-800">
                {returnRequest.user?.name ||
                  "-"}
              </p>

              <p className="mt-1 break-all text-sm text-gray-500">
                {returnRequest.user?.email ||
                  "-"}
              </p>

            </div>

          </div>

          {/* REQUEST TIMELINE */}
          <div className="rounded-xl border border-gray-100 bg-white">

            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={18}
                  className="text-gray-500"
                />

                <h2 className="font-semibold text-gray-800">
                  Timeline
                </h2>
              </div>
            </div>

            <div className="space-y-5 p-5">

              <div className="flex gap-3">
                <Clock3
                  size={17}
                  className="mt-0.5 text-gray-400"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Requested
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {formatDateTime(
                      returnRequest.requestedAt
                    )}
                  </p>
                </div>
              </div>

              {returnRequest.approvedAt && (
                <div className="flex gap-3">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 text-green-500"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Approved
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {formatDateTime(
                        returnRequest.approvedAt
                      )}
                    </p>
                  </div>
                </div>
              )}

              {returnRequest.completedAt && (
                <div className="flex gap-3">
                  <Package
                    size={17}
                    className="mt-0.5 text-green-500"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Completed
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {formatDateTime(
                        returnRequest.completedAt
                      )}
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* UPDATE STATUS */}
          <div className="rounded-xl border border-gray-100 bg-white">

            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-gray-800">
                Update Return
              </h2>
            </div>

            <div className="space-y-4 p-5">

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(
                      e.target.value as ReturnStatus
                    )
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400"
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Approved">
                    Approved
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                  <option value="Picked Up">
                    Picked Up
                  </option>

                  <option value="Received">
                    Received
                  </option>

                  <option value="Refunded">
                    Refunded
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* Admin Comment */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Admin Comment
                </label>

                <textarea
                  value={adminComment}
                  onChange={(e) =>
                    setAdminComment(e.target.value)
                  }
                  rows={4}
                  placeholder="Add a comment for this return..."
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-gray-400"
                />
              </div>

              {/* Existing admin comment */}
              {returnRequest.adminComment && (
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-400">
                    Current Admin Comment
                  </p>

                  <p className="mt-1 text-sm leading-5 text-gray-700">
                    {returnRequest.adminComment}
                  </p>
                </div>
              )}

              {/* Update */}
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Update Return
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ReturnDetails;