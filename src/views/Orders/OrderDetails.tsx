import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  CalendarDays,
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCcw,
  Loader2,
  Save,
  Ban,
} from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [statusForm, setStatusForm] = useState("");

  // =========================================================
  // CANCEL MODAL
  // =========================================================

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [cancelReason, setCancelReason] =
    useState("");

  const [cancelComment, setCancelComment] =
    useState("");

  const token = localStorage.getItem("adminToken");

  // =========================================================
  // FETCH ORDER
  // =========================================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedOrder = response.data.order;

      setOrder(fetchedOrder);
      setStatusForm(fetchedOrder.orderStatus);

    } catch (err: any) {
      console.error(
        "Fetch admin order error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load order details"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // =========================================================
  // STATUS DETAILS
  // =========================================================

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          icon: Clock3,
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "Processing":
        return {
          icon: Package,
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "Packed":
        return {
          icon: Package,
          className:
            "bg-indigo-50 text-indigo-700 border-indigo-200",
        };

      case "Shipped":
        return {
          icon: Truck,
          className:
            "bg-purple-50 text-purple-700 border-purple-200",
        };

      case "Delivered":
        return {
          icon: CheckCircle2,
          className:
            "bg-green-50 text-green-700 border-green-200",
        };

      case "Returned":
      case "Retured":
        return {
          icon: RefreshCcw,
          className:
            "bg-orange-50 text-orange-700 border-orange-200",
        };

      case "Cancelled":
        return {
          icon: XCircle,
          className:
            "bg-red-50 text-red-700 border-red-200",
        };

      default:
        return {
          icon: Clock3,
          className:
            "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const handleUpdateStatus = async () => {
    if (!order || !statusForm) return;

    if (
      order.orderStatus === "Cancelled" ||
      order.orderStatus === "Returned" ||
      order.orderStatus === "Retured"
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/order/admin/${id}`,
        {
          orderStatus: statusForm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(response.data.order);

      setStatusForm(
        response.data.order.orderStatus
      );

      setSuccess(
        "Order status updated successfully."
      );

    } catch (err: any) {
      console.error(
        "Update order status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update order status"
      );

      setStatusForm(order.orderStatus);

    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // OPEN CANCEL MODAL
  // =========================================================

  const openCancelModal = () => {
    setCancelReason("");
    setCancelComment("");
    setError("");
    setSuccess("");
    setShowCancelModal(true);
  };

  // =========================================================
  // CLOSE CANCEL MODAL
  // =========================================================

  const closeCancelModal = () => {
    if (cancelling) return;

    setShowCancelModal(false);
    setCancelReason("");
    setCancelComment("");
  };

  // =========================================================
  // CANCEL ORDER
  // =========================================================

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      setError("Please select a cancellation reason.");
      return;
    }

    try {
      setCancelling(true);
      setError("");
      setSuccess("");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/order/admin/${id}/cancel`,
        {
          reason: cancelReason,
          comment: cancelComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrder =
        response.data.order;

      setOrder(updatedOrder);

      setStatusForm(
        updatedOrder.orderStatus
      );

      setShowCancelModal(false);

      setCancelReason("");
      setCancelComment("");

      setSuccess(
        "Order cancelled successfully."
      );

    } catch (err: any) {
      console.error(
        "Cancel order error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to cancel order"
      );

    } finally {
      setCancelling(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin"
          />

          <p className="text-sm text-gray-500">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !order) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <XCircle
            size={42}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-xl font-semibold">
            Unable to load order
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={() => navigate("/orders")}
            className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusDetails(
    order.orderStatus
  );

  const StatusIcon = status.icon;

  const isLocked =
    order.orderStatus === "Cancelled" ||
    order.orderStatus === "Returned" ||
    order.orderStatus === "Retured";

  // Cancel only before Shipped
  const canAdminCancel =
    order.orderStatus !== "Shipped" &&
    order.orderStatus !== "Delivered" &&
    order.orderStatus !== "Cancelled";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f8f9f7]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">

          <button
            onClick={() => navigate("/orders")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Order ID
              </p>

              <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                #{order._id.slice(-8).toUpperCase()}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays size={15} />

                {formatDate(
                  order.placedAt ||
                    order.createdAt
                )}
              </p>
            </div>

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${status.className}`}
            >
              <StatusIcon size={16} />
              {order.orderStatus}
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* SUCCESS */}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && order && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* =====================================================
            ORDER MANAGEMENT
        ===================================================== */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-2">
            <Package
              size={19}
              className="text-green-600"
            />

            <h2 className="font-semibold text-gray-900">
              Order Management
            </h2>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            {/* ORDER STATUS */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Order Status
              </label>

              {isLocked ? (
                <div>
                  <div
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${status.className}`}
                  >
                    <StatusIcon size={17} />

                    {order.orderStatus}
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    This order cannot be changed because it has already been{" "}
                    {order.orderStatus.toLowerCase()}.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">

                  <select
                    value={statusForm}
                    onChange={(e) =>
                      setStatusForm(
                        e.target.value
                      )
                    }
                    className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-black"
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Packed">
                      Packed
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>
                  </select>

                  <button
                    onClick={
                      handleUpdateStatus
                    }
                    disabled={
                      saving ||
                      statusForm ===
                        order.orderStatus
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={16} />

                        Update Status
                      </>
                    )}
                  </button>

                </div>
              )}

            </div>

            {/* PAYMENT STATUS */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Payment Status
              </label>

              <div className="flex h-11 items-center rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-800">
                {order.paymentStatus}
              </div>

            </div>

          </div>

          {/* ===================================================
              ADMIN CANCEL
          =================================================== */}

          {canAdminCancel && !isLocked && (
            <div className="mt-6 border-t border-gray-100 pt-5">

              <div className="flex flex-col gap-4 rounded-xl border border-red-100 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h3 className="text-sm font-semibold text-red-800">
                    Cancel Order
                  </h3>

                  <p className="mt-1 text-xs text-red-600">
                    Use this only when the order needs to be cancelled by the store.
                  </p>
                </div>

                <button
                  onClick={openCancelModal}
                  disabled={cancelling}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Ban size={16} />

                  Cancel Order
                </button>

              </div>

            </div>
          )}

          {/* ===================================================
              CANCELLATION DETAILS
          =================================================== */}

          {order.orderStatus === "Cancelled" &&
            order.cancellation && (
              <div className="mt-6 border-t border-gray-100 pt-5">

                <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                  <div className="flex items-center gap-2">
                    <XCircle
                      size={18}
                      className="text-red-600"
                    />

                    <h3 className="font-semibold text-red-800">
                      Cancellation Details
                    </h3>
                  </div>

                  <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">

                    <div>
                      <p className="text-xs text-red-500">
                        Reason
                      </p>

                      <p className="mt-1 font-medium text-red-900">
                        {order.cancellation.reason ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-red-500">
                        Cancelled By
                      </p>

                      <p className="mt-1 font-medium capitalize text-red-900">
                        {order.cancellation.cancelledBy ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-red-500">
                        Cancelled On
                      </p>

                      <p className="mt-1 font-medium text-red-900">
                        {order.cancellation.cancelledAt
                          ? formatDate(
                              order.cancellation
                                .cancelledAt
                            )
                          : "N/A"}
                      </p>
                    </div>

                    {order.cancellation.comment && (
                      <div>
                        <p className="text-xs text-red-500">
                          Comment
                        </p>

                        <p className="mt-1 font-medium text-red-900">
                          {
                            order.cancellation
                              .comment
                          }
                        </p>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

        </div>

        {/* =====================================================
            CUSTOMER + SHIPPING
        ===================================================== */}

        <div className="mb-6 grid gap-5 md:grid-cols-2">

          {/* CUSTOMER */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="font-semibold text-gray-900">
              Customer
            </h2>

            <div className="mt-4 space-y-2 text-sm">

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Name
                </span>

                <span className="font-medium text-gray-900">
                  {order.user?.name ||
                    "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Email
                </span>

                <span className="font-medium text-gray-900">
                  {order.user?.email ||
                    "N/A"}
                </span>
              </div>

            </div>
          </div>

          {/* SHIPPING */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-2">

              <MapPin
                size={18}
                className="text-green-600"
              />

              <h2 className="font-semibold text-gray-900">
                Shipping Address
              </h2>

            </div>

            <div className="mt-4 text-sm leading-6 text-gray-600">

              {order.shippingAddress ? (
                <>
                  <p>
                    {order.shippingAddress.name ||
                      order.shippingAddress.fullName}
                  </p>

                  <p>
                    {order.shippingAddress.address}
                  </p>

                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}
                  </p>

                  <p>
                    {order.shippingAddress.pincode}
                  </p>

                  {order.shippingAddress.phone && (
                    <p>
                      Phone:{" "}
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </>
              ) : (
                <p>N/A</p>
              )}

            </div>
          </div>

        </div>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-6 py-4">

            <h2 className="font-semibold text-gray-900">
              Ordered Products
            </h2>

          </div>

          <div className="divide-y divide-gray-100">

            {order.items?.map(
              (item: any) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-6"
                >

                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package
                          size={28}
                          className="text-gray-300"
                        />
                      </div>
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="font-semibold text-gray-900">
                      {item.name}
                    </h3>

                    {item.variantName && (
                      <p className="mt-1 text-sm text-gray-500">
                        Variant:{" "}
                        {item.variantName}
                      </p>
                    )}

                    {item.sku && (
                      <p className="mt-1 text-xs text-gray-400">
                        SKU: {item.sku}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-5 text-sm text-gray-500">

                      <span>
                        Qty:{" "}
                        <strong className="text-gray-800">
                          {item.quantity}
                        </strong>
                      </span>

                      <span>
                        Price:{" "}
                        <strong className="text-gray-800">
                          {formatPrice(
                            item.finalPrice
                          )}
                        </strong>
                      </span>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        </div>

        {/* =====================================================
            ORDER SUMMARY
        ===================================================== */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-2">

            <CreditCard
              size={18}
              className="text-green-600"
            />

            <h2 className="font-semibold text-gray-900">
              Order Summary
            </h2>

          </div>

          <div className="mt-5 max-w-md space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Payment Method
              </span>

              <span className="font-medium capitalize">
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Payment Status
              </span>

              <span className="font-medium">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span>
                {formatPrice(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Discount
              </span>

              <span>
                - {formatPrice(order.discount)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Shipping
              </span>

              <span>
                {order.shippingFee === 0
                  ? "Free"
                  : formatPrice(
                      order.shippingFee
                    )}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-3">

              <div className="flex justify-between">

                <span className="font-semibold">
                  Total
                </span>

                <span className="text-lg font-bold">
                  {formatPrice(order.total)}
                </span>

              </div>

            </div>

          </div>
        </div>

        {/* =====================================================
            TRACKING INFORMATION
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-2">

            <Truck
              size={18}
              className="text-green-600"
            />

            <h2 className="font-semibold text-gray-900">
              Tracking Information
            </h2>

          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3">

            <div>
              <label className="text-xs text-gray-400">
                Tracking Number
              </label>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.shipping?.trackingNumber ||
                  "Not assigned"}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-400">
                Carrier
              </label>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.shipping?.carrier ||
                  "Not assigned"}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-400">
                Estimated Delivery
              </label>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.shipping?.estimatedDeliveryFrom &&
                  order.shipping?.estimatedDeliveryTo
                  ? `${formatDate(order.shipping.estimatedDeliveryFrom)} - ${formatDate(order.shipping.estimatedDeliveryTo)}`
                  : "Not assigned"}
              </p>
            </div>

          </div>
          {/* shipped date */}
          {order.shipping?.shippedAt  && (
            <div className="mt-5 border-t border-gray-100 pt-5">
              <label className="text-xs text-gray-400">
                Shipped On
              </label>

              <div className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(order.shipping.shippedAt)}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* =====================================================
          CANCEL ORDER MODAL
      ===================================================== */}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            {/* HEADER */}

            <div className="border-b border-gray-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <Ban
                    size={19}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Cancel Order
                  </h2>

                  <p className="text-xs text-gray-500">
                    Order #
                    {order._id
                      .slice(-8)
                      .toUpperCase()}
                  </p>
                </div>

              </div>

            </div>

            {/* BODY */}

            <div className="space-y-5 px-6 py-6">

              {/* REASON */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cancellation Reason
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <select
                  value={cancelReason}
                  onChange={(e) =>
                    setCancelReason(
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-black"
                >
                  <option value="">
                    Select a reason
                  </option>

                  <option value="Product out of stock">
                    Product out of stock
                  </option>

                  <option value="Product unavailable">
                    Product unavailable
                  </option>

                  <option value="Payment issue">
                    Payment issue
                  </option>

                  <option value="Invalid shipping address">
                    Invalid shipping address
                  </option>

                  <option value="Technical issue">
                    Technical issue
                  </option>

                  <option value="Order cannot be fulfilled">
                    Order cannot be fulfilled
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              {/* COMMENT */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Additional Comment
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  value={cancelComment}
                  onChange={(e) =>
                    setCancelComment(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Add any additional information for the customer..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-black"
                />

              </div>

              {/* WARNING */}

              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">

                <p className="text-xs leading-5 text-red-700">
                  Once this order is cancelled, it
                  cannot be moved back to another
                  order status.
                </p>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">

              <button
                onClick={closeCancelModal}
                disabled={cancelling}
                className="h-11 flex-1 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Order
              </button>

              <button
                onClick={handleCancelOrder}
                disabled={
                  cancelling ||
                  !cancelReason.trim()
                }
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelling ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Cancelling...
                  </>
                ) : (
                  <>
                    <Ban size={16} />

                    Cancel Order
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default OrderDetails;