import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import CardBox from "../../components/shared/CardBox";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";
import { useNavigate } from "react-router";

interface OrderUser {
  name?: string;
  email?: string;
}

interface Order {
  _id: string;
  orderId?: string;
  total?: number;
  paymentStatus?: string;
  orderStatus?: string;
  createdAt?: string;
  user?: OrderUser;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate= useNavigate()

  // =========================================================
  // FETCH ALL ORDERS
  // =========================================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          toast.error("Admin authentication required");
          setLoading(false);
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

        console.log("Admin orders response:", response.data);

        setOrders(response.data?.orders || []);
      } catch (error) {
        console.error("Fetch orders error:", error);

        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch orders";

        toast.error(message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusClass = (status?: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // PAYMENT STYLE
  // =========================================================

  const getPaymentClass = (status?: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      case "Refunded":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Orders
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage all customer orders
        </p>
      </div>

      {/* =====================================================
          ORDERS CARD
      ====================================================== */}

      <CardBox>
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h5 className="text-lg font-semibold">
              Orders List
            </h5>

            <p className="text-sm text-gray-500">
              View and manage customer orders
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Total Orders:{" "}
            <span className="font-semibold text-gray-700">
              {orders.length}
            </span>
          </div>
        </div>

        {/* =================================================
            TABLE
        ================================================== */}

        <Table>
          {/* TABLE HEADER */}
          <TableHeader>
            <TableRow>
              <TableHead>
                Order ID
              </TableHead>

              <TableHead>
                Customer
              </TableHead>

              <TableHead>
                Date
              </TableHead>

              <TableHead>
                Amount
              </TableHead>

              <TableHead>
                Payment
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* TABLE BODY */}
          <TableBody>
            {/* LOADING */}
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              /* EMPTY */
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              /* ORDERS */
              orders.map((order) => (
                <TableRow key={order._id}>

                  {/* ORDER ID */}
                  <TableCell className="font-medium">
                    {order.orderId || order._id}
                  </TableCell>

                  {/* CUSTOMER */}
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {order.user?.name || "Customer"}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {order.user?.email || "-"}
                      </p>
                    </div>
                  </TableCell>

                  {/* DATE */}
                  <TableCell>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString("en-IN")
                      : "-"}
                  </TableCell>

                  {/* AMOUNT */}
                  <TableCell className="font-medium">
                    ₹
                    {Number(
                      order.total || 0
                    ).toLocaleString("en-IN")}
                  </TableCell>

                  {/* PAYMENT */}
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentClass(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus || "-"}
                    </span>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus || "-"}
                    </span>
                  </TableCell>

                  {/* ACTION */}
                  <TableCell>
                    <button
                      type="button"
                      onClick={()=>navigate(`/ostik-admin/orders/${order._id}`)}
                      className="text-primary hover:underline font-medium"
                    >
                      View
                    </button>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardBox>
    </div>
  );
};

export default Orders;