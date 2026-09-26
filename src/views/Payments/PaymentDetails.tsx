import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import CardBox from "../../components/shared/CardBox";

interface User {
  _id: string;
  name?: string;
  email?: string;
  profileImage?: string;
  country?: string;
}

interface OrderItem {
  _id?: string;
  productId?: string;
  variantId?: string;
  name?: string;
  variantName?: string;
  sku?: string;
  image?: string;
  price?: number;
  discountPercent?: number;
  finalPrice?: number;
  quantity?: number;
  total?: number;
}

interface Order {
  _id: string;

  user?: string;

  shippingAddress?: unknown;

  items?: OrderItem[];

  paymentMethod?: string;

  paymentStatus?: string;

  subtotal?: number;

  discount?: number;

  shippingFee?: number;

  total?: number;

  currency?: string;

  exchangeRateUsed?: number;

  orderStatus?: string;

  trackingNumber?: string;

  carrier?: string;

  estimatedDelivery?: string | null;

  trackingHistory?: unknown[];

  placedAt?: string;

  createdAt?: string;

  updatedAt?: string;
}

interface Payment {
  _id: string;

  order?: Order;

  user?: User;

  paymentGateway: string;

  amount: number;

  currency?: string;

  status:
    | "Pending"
    | "Success"
    | "Failed"
    | "Refunded";

  transactionId?: string;

  razorpayOrderId?: string;

  razorpayPaymentId?: string;

  razorpaySignature?: string;

  failureReason?: string;

  paidAt?: string | null;

  createdAt?: string;

  updatedAt?: string;
}

const PaymentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [payment, setPayment] =
    useState<Payment | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  // =========================================================
  // FETCH PAYMENT
  // =========================================================

  const fetchPayment = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error(
          "Admin authentication required"
        );
        return;
      }

      if (!id) {
        toast.error(
          "Payment ID is missing"
        );
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payment/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "PAYMENT DETAILS:",
        response.data?.payment
      );

      console.log(
        "ORDER DETAILS:",
        response.data?.payment?.order
      );

      setPayment(
        response.data?.payment || null
      );
    } catch (error: unknown) {
      console.error(
        "Payment details error:",
        error
      );

      if (axios.isAxiosError(error)) {
        console.error(
          "Status:",
          error.response?.status
        );

        console.error(
          "Response:",
          error.response?.data
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to fetch payment"
        );
      } else {
        toast.error(
          "Failed to fetch payment"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [id]);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (
    date?: string | null
  ): string => {
    if (!date) {
      return "-";
    }

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

  // =========================================================
  // FORMAT AMOUNT
  // =========================================================

  const formatAmount = (
    amount?: number,
    currency = "INR"
  ): string => {
    if (
      amount === undefined ||
      amount === null
    ) {
      return "-";
    }

    if (currency === "INR") {
      return `₹${Number(
        amount
      ).toLocaleString("en-IN")}`;
    }

    return `${currency} ${Number(
      amount
    ).toLocaleString("en-IN")}`;
  };

  // =========================================================
  // PAYMENT STATUS STYLE
  // =========================================================

  const getPaymentStatusClass = (
    status?: string
  ): string => {
    switch (status) {
      case "Success":
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      case "Refunded":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // ORDER STATUS STYLE
  // =========================================================

  const getOrderStatusClass = (
    status?: string
  ): string => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-indigo-100 text-indigo-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Returned":
        return "bg-orange-100 text-orange-700";

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
          Loading payment...
        </div>
      </CardBox>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!payment) {
    return (
      <CardBox>
        <div className="py-12 text-center">

          <p className="mb-4 text-gray-500">
            Payment not found
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/ostik-admin/payments"
              )
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Back to Payments
          </button>

        </div>
      </CardBox>
    );
  }

  const order = payment.order;

  const paymentStatus =
    order?.paymentStatus ||
    payment.status;

  const orderStatus =
    order?.orderStatus || "-";

  const currency =
    order?.currency ||
    payment.currency ||
    "INR";

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-semibold">
              Payment Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View complete payment transaction details
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/ostik-admin/payments"
              )
            }
            className="w-fit rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Back
          </button>

        </div>

      </div>


      {/* =====================================================
          TOP SECTION
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ===================================================
            CUSTOMER
        ==================================================== */}

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Customer
          </h5>

          <div className="flex items-center gap-4">

            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">

              {payment.user?.profileImage ? (

                <img
                  src={
                    payment.user.profileImage
                  }
                  alt={
                    payment.user.name ||
                    "Customer"
                  }
                  className="h-full w-full object-cover"
                />

              ) : (

                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-500">
                  {payment.user?.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "U"}
                </div>

              )}

            </div>

            <div className="min-w-0">

              <p className="font-semibold text-gray-800">
                {payment.user?.name ||
                  "Unknown customer"}
              </p>

              <p className="mt-1 break-all text-sm text-gray-500">
                {payment.user?.email ||
                  "-"}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {payment.user?.country ||
                  "-"}
              </p>

            </div>

          </div>

        </CardBox>


        {/* ===================================================
            ORDER
        ==================================================== */}

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Order
          </h5>

          <div className="space-y-4">

            {/* ORDER ID */}

            <div>

              <p className="text-sm text-gray-500">
                Order ID
              </p>

              <p className="mt-1 break-all font-medium text-gray-800">
                {order?._id || "-"}
              </p>

            </div>


            {/* ORDER AMOUNT */}

            <div>

              <p className="text-sm text-gray-500">
                Order Amount
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-800">
                {formatAmount(
                  order?.total ??
                    payment.amount,
                  currency
                )}
              </p>

            </div>


            {/* ORDER STATUS */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Order Status
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusClass(
                  orderStatus
                )}`}
              >
                {orderStatus}
              </span>

            </div>


            {/* PAYMENT STATUS */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Payment Status
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                  paymentStatus
                )}`}
              >
                {paymentStatus}
              </span>

            </div>

          </div>

        </CardBox>


        {/* ===================================================
            PAYMENT SUMMARY
        ==================================================== */}

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Payment Summary
          </h5>

          <div className="space-y-4">

            {/* STATUS */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Payment Status
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                  payment.status
                )}`}
              >
                {payment.status}
              </span>

            </div>


            {/* GATEWAY */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Payment Gateway
              </p>

              <p className="font-medium capitalize">
                {payment.paymentGateway ||
                  "-"}
              </p>

            </div>


            {/* AMOUNT */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Paid Amount
              </p>

              <p className="text-xl font-semibold">
                {formatAmount(
                  payment.amount,
                  payment.currency ||
                    "INR"
                )}
              </p>

            </div>

          </div>

        </CardBox>

      </div>


      {/* =====================================================
          PAYMENT INFORMATION
      ====================================================== */}

      <div className="mt-6">

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Payment Information
          </h5>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            {/* PAYMENT ID */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Payment ID
              </p>

              <p className="break-all font-medium">
                {payment._id}
              </p>

            </div>


            {/* TRANSACTION ID */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Transaction ID
              </p>

              <p className="break-all font-medium">
                {payment.transactionId ||
                  "-"}
              </p>

            </div>


            {/* PAYMENT METHOD */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Payment Method
              </p>

              <p className="font-medium capitalize">
                {payment.paymentGateway ||
                  "-"}
              </p>

            </div>


            {/* CURRENCY */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Currency
              </p>

              <p className="font-medium">
                {payment.currency ||
                  "INR"}
              </p>

            </div>


            {/* CREATED */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Payment Created
              </p>

              <p className="font-medium">
                {formatDate(
                  payment.createdAt
                )}
              </p>

            </div>


            {/* PAID AT */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Paid At
              </p>

              <p className="font-medium">
                {formatDate(
                  payment.paidAt
                )}
              </p>

            </div>


            {/* UPDATED */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Last Updated
              </p>

              <p className="font-medium">
                {formatDate(
                  payment.updatedAt
                )}
              </p>

            </div>

          </div>

        </CardBox>

      </div>


      {/* =====================================================
          RAZORPAY INFORMATION
      ====================================================== */}

      {payment.paymentGateway ===
        "razorpay" && (

        <div className="mt-6">

          <CardBox>

            <h5 className="mb-5 text-lg font-semibold">
              Razorpay Information
            </h5>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

              {/* RAZORPAY ORDER ID */}

              <div>

                <p className="mb-1 text-sm text-gray-500">
                  Razorpay Order ID
                </p>

                <p className="break-all font-medium">
                  {payment.razorpayOrderId ||
                    "-"}
                </p>

              </div>


              {/* RAZORPAY PAYMENT ID */}

              <div>

                <p className="mb-1 text-sm text-gray-500">
                  Razorpay Payment ID
                </p>

                <p className="break-all font-medium">
                  {payment.razorpayPaymentId ||
                    "-"}
                </p>

              </div>


              {/* SIGNATURE */}

              <div className="sm:col-span-2">

                <p className="mb-1 text-sm text-gray-500">
                  Razorpay Signature
                </p>

                <p className="break-all rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                  {payment.razorpaySignature ||
                    "-"}
                </p>

              </div>

            </div>

          </CardBox>

        </div>

      )}


      {/* =====================================================
          FAILURE INFORMATION
      ====================================================== */}

      {payment.status ===
        "Failed" &&
        payment.failureReason && (

        <div className="mt-6">

          <CardBox>

            <h5 className="mb-4 text-lg font-semibold">
              Failure Information
            </h5>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">

              <p className="text-sm text-red-700">
                {payment.failureReason}
              </p>

            </div>

          </CardBox>

        </div>

      )}


      {/* =====================================================
          ORDER SUMMARY
      ====================================================== */}

      <div className="mt-6">

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Order Summary
          </h5>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* SUBTOTAL */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Subtotal
              </p>

              <p className="font-medium">
                {formatAmount(
                  order?.subtotal,
                  currency
                )}
              </p>

            </div>


            {/* DISCOUNT */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Discount
              </p>

              <p className="font-medium">
                {formatAmount(
                  order?.discount,
                  currency
                )}
              </p>

            </div>


            {/* SHIPPING */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Shipping Fee
              </p>

              <p className="font-medium">
                {formatAmount(
                  order?.shippingFee,
                  currency
                )}
              </p>

            </div>


            {/* TOTAL */}

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Total
              </p>

              <p className="text-lg font-semibold">
                {formatAmount(
                  order?.total ??
                    payment.amount,
                  currency
                )}
              </p>

            </div>

          </div>

        </CardBox>

      </div>


      {/* =====================================================
          ORDERED ITEMS
      ====================================================== */}

      {order?.items &&
        order.items.length > 0 && (

        <div className="mt-6">

          <CardBox>

            <h5 className="mb-5 text-lg font-semibold">
              Ordered Items
            </h5>

            <div className="space-y-3">

              {order.items.map(
                (item, index) => (

                  <div
                    key={
                      item._id ||
                      `${item.name}-${index}`
                    }
                    className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >

                    {/* PRODUCT */}

                    <div className="flex min-w-0 items-center gap-4">

                      {/* PRODUCT IMAGE */}

                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">

                        {item.image ? (

                          <img
                            src={item.image}
                            alt={
                              item.name ||
                              "Product"
                            }
                            className="h-full w-full object-contain p-1"
                          />

                        ) : (

                          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                            No image
                          </div>

                        )}

                      </div>


                      <div className="min-w-0">

                        <p className="font-medium">
                          {item.name ||
                            "Product"}
                        </p>

                        {item.variantName && (
                          <p className="mt-1 text-sm text-gray-500">
                            Variant:{" "}
                            {item.variantName}
                          </p>
                        )}

                        {item.sku && (
                          <p className="mt-1 break-all text-xs text-gray-400">
                            SKU: {item.sku}
                          </p>
                        )}

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity:{" "}
                          {item.quantity || 0}
                        </p>

                      </div>

                    </div>


                    {/* PRICE */}

                    <div className="shrink-0 sm:text-right">

                      <p className="font-medium">
                        {formatAmount(
                          item.finalPrice ??
                            item.price,
                          currency
                        )}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Qty:{" "}
                        {item.quantity || 0}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </CardBox>

        </div>

      )}


      {/* =====================================================
          ORDER DATES
      ====================================================== */}

      <div className="mt-6">

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Order Dates
          </h5>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            <div>

              <p className="mb-1 text-sm text-gray-500">
                Order Created
              </p>

              <p className="font-medium">
                {formatDate(
                  order?.createdAt
                )}
              </p>

            </div>


            <div>

              <p className="mb-1 text-sm text-gray-500">
                Order Placed
              </p>

              <p className="font-medium">
                {formatDate(
                  order?.placedAt
                )}
              </p>

            </div>

          </div>

        </CardBox>

      </div>

    </div>
  );
};

export default PaymentDetails;