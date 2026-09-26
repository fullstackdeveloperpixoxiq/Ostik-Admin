import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  CalendarDays,
  User,
  Mail,
  Clock3,
  CheckCircle2,
  XCircle,
  Truck,
  RefreshCw,
  Save,
  ArrowRight,
} from "lucide-react";

const ExchangeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exchange, setExchange] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [adminComment, setAdminComment] = useState("");

  // =====================================================
  // FETCH SINGLE EXCHANGE
  // =====================================================

  const fetchExchange = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/ostik-admin/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/exchange/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const exchangeRequest =
        response.data?.exchangeRequest;

      setExchange(exchangeRequest);
      setStatus(exchangeRequest?.status || "");
      setAdminComment(
        exchangeRequest?.adminComment || ""
      );
    } catch (err: any) {
      console.error(
        "Fetch exchange details error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/ostik-admin/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load exchange details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchange();
  }, [id]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
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

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusDetails = (currentStatus: string) => {
    switch (currentStatus) {
      case "Pending":
        return {
          icon: Clock3,
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "Approved":
        return {
          icon: CheckCircle2,
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "Rejected":
        return {
          icon: XCircle,
          className:
            "bg-red-50 text-red-700 border-red-200",
        };

      case "Pickup Scheduled":
        return {
          icon: Truck,
          className:
            "bg-purple-50 text-purple-700 border-purple-200",
        };

      case "Received":
        return {
          icon: Package,
          className:
            "bg-indigo-50 text-indigo-700 border-indigo-200",
        };

      case "Replacement Shipped":
        return {
          icon: Truck,
          className:
            "bg-cyan-50 text-cyan-700 border-cyan-200",
        };

      case "Completed":
        return {
          icon: CheckCircle2,
          className:
            "bg-green-50 text-green-700 border-green-200",
        };

      case "Cancelled":
        return {
          icon: XCircle,
          className:
            "bg-gray-50 text-gray-600 border-gray-200",
        };

      default:
        return {
          icon: Clock3,
          className:
            "bg-gray-50 text-gray-600 border-gray-200",
        };
    }
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleUpdateStatus = async () => {
    try {
      if (!status) return;

      setSaving(true);

      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/exchange/admin/${exchange._id}/status`,
        {
          status,
          adminComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchExchange();
    } catch (err: any) {
      console.error(
        "Update exchange status error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to update exchange status"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">

          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-green-600"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading exchange details...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !exchange) {
    return (
      <div className="p-6">

        <button
          onClick={() =>
            navigate("/ostik-admin/exchanges")
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Exchanges
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

          <XCircle
            size={36}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-3 text-lg font-semibold text-gray-900">
            Unable to load exchange
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {error || "Exchange request not found"}
          </p>

        </div>
      </div>
    );
  }

  const statusDetails = getStatusDetails(
    exchange.status
  );

  const StatusIcon = statusDetails.icon;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* BACK */}

      <button
        onClick={() =>
          navigate("/ostik-admin/exchanges")
        }
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
      >
        <ArrowLeft size={17} />
        Back to Exchanges
      </button>

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Exchange Request
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-gray-900">
            #
            {exchange._id
              ?.slice(-8)
              .toUpperCase()}
          </h1>

          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={15} />

            {formatDateTime(
              exchange.requestedAt ||
                exchange.createdAt
            )}
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${statusDetails.className}`}
        >
          <StatusIcon size={16} />
          {exchange.status}
        </div>

      </div>

      {/* PRODUCTS */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Exchange Products
          </h2>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-2">

          {/* ORIGINAL */}

          <div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Original Product
            </p>

            <div className="flex gap-4 rounded-xl border border-gray-200 p-4">

              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">

                {exchange.item?.image ? (
                  <img
                    src={exchange.item.image}
                    alt={exchange.item.name}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <Package
                    size={26}
                    className="mx-auto mt-6 text-gray-300"
                  />
                )}

              </div>

              <div className="min-w-0">

                <h3 className="font-semibold text-gray-900">
                  {exchange.item?.name}
                </h3>

                {exchange.item
                  ?.variantName && (
                  <p className="mt-1 text-sm text-gray-500">
                    Variant:{" "}
                    {exchange.item.variantName}
                  </p>
                )}

                <p className="mt-1 text-xs text-gray-400">
                  SKU:{" "}
                  {exchange.item?.sku || "-"}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Quantity:{" "}
                  <span className="font-medium text-gray-900">
                    {exchange.item?.quantity}
                  </span>
                </p>

              </div>
            </div>
          </div>

          {/* EXCHANGE */}

          <div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Requested Exchange Product
            </p>

            <div className="flex gap-4 rounded-xl border border-blue-100 bg-blue-50/30 p-4">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">

                {exchange.exchangeItem
                  ?.image ? (
                  <img
                    src={
                      exchange.exchangeItem
                        .image
                    }
                    alt={
                      exchange.exchangeItem
                        .name
                    }
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <Package
                    size={26}
                    className="text-gray-300"
                  />
                )}

              </div>

              <div className="min-w-0">

                <h3 className="font-semibold text-gray-900">
                  {
                    exchange.exchangeItem
                      ?.name
                  }
                </h3>

                {exchange.exchangeItem
                  ?.variantName && (
                  <p className="mt-1 text-sm text-gray-500">
                    Variant:{" "}
                    {
                      exchange.exchangeItem
                        .variantName
                    }
                  </p>
                )}

                <p className="mt-1 text-xs text-gray-400">
                  SKU:{" "}
                  {exchange.exchangeItem
                    ?.sku || "-"}
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  ₹
                  {Number(
                    exchange.exchangeItem
                      ?.price || 0
                  ).toLocaleString("en-IN")}
                </p>

              </div>
            </div>
          </div>

        </div>

        <div className="flex items-center justify-center border-t border-gray-100 py-3">
          <ArrowRight
            size={18}
            className="text-gray-400"
          />
        </div>

      </div>

      {/* REASON + COMMENT */}

      <div className="mb-5 grid gap-5 md:grid-cols-2">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-gray-900">
            Exchange Reason
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {exchange.reason || "-"}
          </p>

        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-gray-900">
            Customer Comment
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {exchange.comment || "No comment provided"}
          </p>

        </div>

      </div>

      {/* CUSTOMER + ORDER */}

      <div className="mb-5 grid gap-5 md:grid-cols-2">

        {/* CUSTOMER */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-2">

            <User
              size={18}
              className="text-green-600"
            />

            <h2 className="font-semibold text-gray-900">
              Customer
            </h2>

          </div>

          <div className="mt-4 space-y-3 text-sm">

            <div className="flex items-center gap-3">
              <User
                size={16}
                className="text-gray-400"
              />

              <span className="text-gray-700">
                {exchange.user?.name ||
                  "Unknown"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Mail
                size={16}
                className="text-gray-400"
              />

              <span className="text-gray-700">
                {exchange.user?.email ||
                  "-"}
              </span>
            </div>

          </div>
        </div>

        {/* ORDER */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-2">

            <Package
              size={18}
              className="text-green-600"
            />

            <h2 className="font-semibold text-gray-900">
              Order
            </h2>

          </div>

          <div className="mt-4 space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Order ID
              </span>

              <span className="font-medium text-gray-900">
                #
                {exchange.order?._id
                  ?.slice(-8)
                  .toUpperCase() ||
                  "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Order Status
              </span>

              <span className="font-medium text-gray-900">
                {exchange.order
                  ?.orderStatus || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Order Total
              </span>

              <span className="font-medium text-gray-900">
                ₹
                {Number(
                  exchange.order?.total || 0
                ).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Ordered On
              </span>

              <span className="font-medium text-gray-900">
                {formatDate(
                  exchange.order?.placedAt
                )}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* TIMELINE */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <h2 className="font-semibold text-gray-900">
          Exchange Timeline
        </h2>

        <div className="mt-5 space-y-5">

          <div className="flex gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50">
              <Clock3
                size={16}
                className="text-amber-600"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                Exchange Requested
              </p>

              <p className="text-xs text-gray-500">
                {formatDateTime(
                  exchange.requestedAt ||
                    exchange.createdAt
                )}
              </p>
            </div>

          </div>

          {exchange.approvedAt && (
            <div className="flex gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <CheckCircle2
                  size={16}
                  className="text-blue-600"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Exchange Approved
                </p>

                <p className="text-xs text-gray-500">
                  {formatDateTime(
                    exchange.approvedAt
                  )}
                </p>
              </div>

            </div>
          )}

          {exchange.completedAt && (
            <div className="flex gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2
                  size={16}
                  className="text-green-600"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Exchange Completed
                </p>

                <p className="text-xs text-gray-500">
                  {formatDateTime(
                    exchange.completedAt
                  )}
                </p>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* UPDATE STATUS */}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <h2 className="font-semibold text-gray-900">
          Update Exchange
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">

          {/* STATUS */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Exchange Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
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

              <option value="Pickup Scheduled">
                Pickup Scheduled
              </option>

              <option value="Received">
                Received
              </option>

              <option value="Replacement Shipped">
                Replacement Shipped
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

          </div>

          {/* ADMIN COMMENT */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Admin Comment
            </label>

            <textarea
              value={adminComment}
              onChange={(e) =>
                setAdminComment(
                  e.target.value
                )
              }
              rows={4}
              placeholder="Add a comment..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500"
            />

          </div>

        </div>

        <div className="mt-5 flex justify-end">

          <button
            onClick={handleUpdateStatus}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />
                Updating...
              </>
            ) : (
              <>
                <Save size={16} />
                Update Exchange
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ExchangeDetails;