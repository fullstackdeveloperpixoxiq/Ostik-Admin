import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  XCircle,
  Eye,
  Loader2,
  Package,
  CalendarDays,
  User,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// =========================================================
// TYPES
// =========================================================

interface OrderItem {
  _id?: string;
  productId?: string;
  variantId?: string | null;
  name?: string;
  variantName?: string;
  sku?: string;
  image?: string;
  price?: number;
  discountPercent?: number;
  finalPrice?: number;
  quantity?: number;
}

interface Cancellation {
  reason?: string;
  comment?: string;
  cancelledAt?: string | null;
  cancelledBy?: "user" | "admin" | null;
}

interface UserInfo {
  _id?: string;
  name?: string;
  email?: string;
}

interface Order {
  _id: string;
  user?: UserInfo;
  items?: OrderItem[];
  total?: number;
  paymentMethod?: "cod" | "razorpay";
  orderStatus?: string;
  placedAt?: string;
  cancellation?: Cancellation;
}

// =========================================================
// COMPONENT
// =========================================================

const Cancellations = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem("adminToken");

  // =========================================================
  // FETCH CANCELLED ORDERS
  // =========================================================

  const fetchCancelledOrders = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const allOrders: Order[] =
        response.data.orders || [];

      const cancelledOrders = allOrders.filter(
        (order) => order.orderStatus === "Cancelled"
      );

      setOrders(cancelledOrders);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load cancelled orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelledOrders();
  }, []);

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (
    date?: string | null
  ): string => {
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

  const formatDateTime = (
    date?: string | null
  ): string => {
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

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-green-600"
        />
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <XCircle
                size={23}
                className="text-red-500"
              />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Cancellations
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View and manage cancelled orders.
              </p>
            </div>

          </div>
        </div>

        {/* COUNT */}

        <div className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">

          <XCircle
            size={17}
            className="text-red-500"
          />

          <span className="text-sm text-gray-500">
            Cancelled Orders
          </span>

          <span className="font-semibold text-gray-900">
            {orders.length}
          </span>

        </div>

      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {orders.length === 0 ? (

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <XCircle
              size={30}
              className="text-gray-400"
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No cancelled orders
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            There are no cancelled orders available at the moment.
          </p>

        </div>

      ) : (

        /* ===================================================
           TABLE
        =================================================== */

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead>

                <tr className="border-b border-gray-100 bg-gray-50">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reason
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Cancelled By
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {orders.map((order) => {

                  const firstItem =
                    order.items?.[0];

                  const productCount =
                    order.items?.length || 0;

                  return (
                    <tr
                      key={order._id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* ORDER */}

                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-gray-900">
                          #
                          {order._id
                            .slice(-8)
                            .toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatDate(
                            order.placedAt
                          )}
                        </p>

                      </td>

                      {/* CUSTOMER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <User
                              size={15}
                              className="text-gray-500"
                            />
                          </div>

                          <div>

                            <p className="text-sm font-medium text-gray-800">
                              {order.user?.name ||
                                "Unknown"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {order.user?.email ||
                                "-"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PRODUCT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">

                            {firstItem?.image ? (

                              <img
                                src={
                                  firstItem.image
                                }
                                alt={
                                  firstItem.name ||
                                  "Product"
                                }
                                className="h-full w-full object-contain p-1"
                              />

                            ) : (

                              <div className="flex h-full items-center justify-center">

                                <Package
                                  size={20}
                                  className="text-gray-300"
                                />

                              </div>

                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="max-w-[220px] truncate text-sm font-medium text-gray-800">
                              {firstItem?.name ||
                                "Product"}
                            </p>

                            {firstItem?.variantName && (
                              <p className="mt-1 text-xs text-gray-400">
                                {
                                  firstItem.variantName
                                }
                              </p>
                            )}

                            {productCount > 1 && (
                              <p className="mt-1 text-xs text-gray-400">
                                +{" "}
                                {productCount - 1}{" "}
                                more item
                                {productCount - 1 >
                                1
                                  ? "s"
                                  : ""}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* TOTAL */}

                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-gray-900">
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {order.paymentMethod ===
                          "razorpay"
                            ? "Razorpay"
                            : "COD"}
                        </p>

                      </td>

                      {/* REASON */}

                      <td className="px-5 py-4">

                        <div className="flex max-w-[180px] items-start gap-2">

                          <AlertCircle
                            size={16}
                            className="mt-0.5 shrink-0 text-red-400"
                          />

                          <div>

                            <p className="text-sm font-medium text-gray-700">
                              {order.cancellation
                                ?.reason ||
                                "Not specified"}
                            </p>

                            {order.cancellation
                              ?.comment && (

                              <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                                {
                                  order
                                    .cancellation
                                    .comment
                                }
                              </p>

                            )}

                          </div>

                        </div>

                      </td>

                      {/* CANCELLED BY */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                            order.cancellation
                              ?.cancelledBy ===
                            "admin"
                              ? "border-purple-200 bg-purple-50 text-purple-700"
                              : "border-orange-200 bg-orange-50 text-orange-700"
                          }`}
                        >
                          {order.cancellation
                            ?.cancelledBy ===
                          "admin"
                            ? "Admin"
                            : "User"}
                        </span>

                      </td>

                      {/* DATE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={15}
                            className="text-gray-400"
                          />

                          <div>

                            <p className="text-sm text-gray-700">
                              {formatDate(
                                order
                                  .cancellation
                                  ?.cancelledAt
                              )}
                            </p>

                            <p className="text-xs text-gray-400">
                              {formatDateTime(
                                order
                                  .cancellation
                                  ?.cancelledAt
                              )
                                .split(",")[1]
                                ?.trim()}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4 text-center">

                        <button
                          onClick={() =>
                            navigate(
                              `/ostik-admin/orders/${order._id}`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                        >
                          <Eye size={16} />
                          View
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default Cancellations;
