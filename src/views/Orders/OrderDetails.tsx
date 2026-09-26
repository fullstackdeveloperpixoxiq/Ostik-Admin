import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CalendarDays,
  Mail,
  Phone,
} from "lucide-react";

interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  sku?: string;
  image?: string;
  price: number;
  discountPercent?: number;
  finalPrice: number;
  quantity: number;
}

interface ShippingAddress {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

interface UserDetails {
  _id: string;
  name: string;
  email: string;
}

interface Order {
  _id: string;
  user: UserDetails;
  shippingAddress: ShippingAddress;
  items: OrderItem[];

  paymentMethod: "cod" | "razorpay";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";

  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  currency: string;
  exchangeRateUsed?: number;

  orderStatus:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Returned"
    | "Cancelled";

  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;

  placedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          setError("Admin authentication required.");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/order/admin/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(response.data.order);
      } catch (err: any) {
        console.error("Failed to fetch order:", err);

        setError(
          err.response?.data?.message || "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Processing":
        return "bg-yellow-100 text-yellow-700";

      case "Pending":
        return "bg-orange-100 text-orange-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Returned":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      case "Refunded":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl p-10 text-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div className="bg-white rounded-xl p-10 text-center">
          <p className="text-red-500">
            {error || "Order not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-gray-500 hover:text-primary mb-3"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </button>

          <h1 className="text-2xl font-semibold text-gray-800">
            Order Details
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Order ID:{" "}
            <span className="font-medium text-gray-700">
              #{order._id}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Order information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Order date */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <CalendarDays size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Order Date
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {formatDate(order.placedAt || order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <CreditCard size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Payment
              </p>

              <p className="font-medium text-gray-800 mt-1 capitalize">
                {order.paymentMethod}
              </p>

              <span
                className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Package size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Order Total
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                ₹{order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Customer + Shipping */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Customer */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User size={20} />
              Customer Details
            </h2>
          </div>

          <div className="p-5 space-y-4">

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {order.user?.name || order.shippingAddress?.name || "-"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={17} className="text-gray-400" />

              <div>
                <p className="text-xs text-gray-500">
                  Email
                </p>

                <p className="text-sm text-gray-800">
                  {order.user?.email ||
                    order.shippingAddress?.email ||
                    "-"}
                </p>
              </div>
            </div>

            {order.shippingAddress?.phone && (
              <div className="flex items-center gap-3">
                <Phone size={17} className="text-gray-400" />

                <div>
                  <p className="text-xs text-gray-500">
                    Phone
                  </p>

                  <p className="text-sm text-gray-800">
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPin size={20} />
              Shipping Address
            </h2>
          </div>

          <div className="p-5 text-sm text-gray-700 leading-6">

            {order.shippingAddress?.name && (
              <p className="font-medium">
                {order.shippingAddress.name}
              </p>
            )}

            {order.shippingAddress?.address && (
              <p>{order.shippingAddress.address}</p>
            )}

            <p>
              {order.shippingAddress?.city}
              {order.shippingAddress?.city &&
              order.shippingAddress?.state
                ? ", "
                : ""}
              {order.shippingAddress?.state}
            </p>

            {order.shippingAddress?.pincode && (
              <p>
                PIN: {order.shippingAddress.pincode}
              </p>
            )}

            {order.shippingAddress?.country && (
              <p>
                {order.shippingAddress.country}
              </p>
            )}

            {order.shippingAddress?.phone && (
              <p className="mt-2">
                Phone: {order.shippingAddress.phone}
              </p>
            )}

          </div>
        </div>

      </div>

      {/* Products */}
      <div className="bg-white rounded-xl shadow-sm">

        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Package size={20} />
            Ordered Products
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                <th className="px-5 py-4">
                  Product
                </th>

                <th className="px-5 py-4">
                  SKU
                </th>

                <th className="px-5 py-4">
                  Price
                </th>

                <th className="px-5 py-4">
                  Qty
                </th>

                <th className="px-5 py-4 text-right">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>

              {order.items?.map((item, index) => (
                <tr
                  key={`${item.productId}-${index}`}
                  className="border-b border-gray-100 last:border-0"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-4">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package
                            size={22}
                            className="text-gray-400"
                          />
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-gray-800">
                          {item.name}
                        </p>

                        {item.variantName && (
                          <p className="text-sm text-gray-500 mt-1">
                            Variant: {item.variantName}
                          </p>
                        )}

                        {item.discountPercent &&
                        item.discountPercent > 0 ? (
                          <p className="text-xs text-green-600 mt-1">
                            {item.discountPercent}% discount
                          </p>
                        ) : null}
                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {item.sku || "-"}
                  </td>

                  <td className="px-5 py-4">

                    <div>
                      {item.price !== item.finalPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{item.price.toFixed(2)}
                        </p>
                      )}

                      <p className="font-medium text-gray-800">
                        ₹{item.finalPrice.toFixed(2)}
                      </p>
                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {item.quantity}
                  </td>

                  <td className="px-5 py-4 text-right font-medium text-gray-800">
                    ₹
                    {(item.finalPrice * item.quantity).toFixed(2)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Tracking */}
        <div className="bg-white rounded-xl shadow-sm">

          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Truck size={20} />
              Shipping & Tracking
            </h2>
          </div>

          <div className="p-5 space-y-4">

            <div>
              <p className="text-sm text-gray-500">
                Carrier
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {order.carrier || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Tracking Number
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {order.trackingNumber || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Estimated Delivery
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {order.estimatedDelivery
                  ? formatDate(order.estimatedDelivery)
                  : "-"}
              </p>
            </div>

          </div>

        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl shadow-sm">

          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Order Summary
            </h2>
          </div>

          <div className="p-5 space-y-3">

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="text-gray-800">
                ₹{order.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Discount
              </span>

              <span className="text-green-600">
                - ₹{order.discount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Shipping Fee
              </span>

              <span className="text-gray-800">
                ₹{order.shippingFee.toFixed(2)}
              </span>
            </div>

            <div className="border-t pt-4 mt-4 flex justify-between">
              <span className="font-semibold text-gray-800">
                Total
              </span>

              <span className="text-xl font-semibold text-gray-800">
                ₹{order.total.toFixed(2)}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;