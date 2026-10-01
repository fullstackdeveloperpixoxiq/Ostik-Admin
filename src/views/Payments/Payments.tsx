import { useEffect, useState } from "react";
import axios from "axios";
import { Eye } from "lucide-react";
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

interface User {
  _id: string;
  name?: string;
  email?: string;
  profileImage?: string;
}

interface Order {
  _id: string;
  orderId?: string;
  total?: number;
  orderStatus?: string;
  paymentStatus?: string;
  currency?: string;
}

interface Payment {
  _id: string;
  amount: number;
  currency?: string;
  paymentGateway: string;
  status: "Pending" | "Success" | "Failed" | "Refunded";
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: string | null;
  createdAt?: string;
  user?: User;
  order?: Order;
}

const Payments = () => {
  const navigate = useNavigate();

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  // =========================================================
  // FETCH PAYMENTS
  // =========================================================

  const fetchPayments = async () => {
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

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payment/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayments(
        response.data?.payments || []
      );
    } catch (error: unknown) {
      console.error(
        "Fetch payments error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch payments";

      toast.error(
        message || "Failed to fetch payments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (
    date?: string
  ): string => {
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
  // FORMAT AMOUNT
  // =========================================================

  const formatAmount = (
    amount: number,
    currency = "INR"
  ) => {
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
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (
    status: Payment["status"]
  ) => {
    switch (status) {
      case "Success":
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
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <CardBox>
        <div className="py-12 text-center text-gray-500">
          Loading payments...
        </div>
      </CardBox>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Payments
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View customer payment transactions
        </p>
      </div>


      {/* DESKTOP TABLE */}

      <div className="hidden md:block">
        <CardBox className="overflow-hidden p-0">

          <Table>

            <TableHeader>
              <TableRow>

                <TableHead>
                  Payment ID
                </TableHead>

                <TableHead>
                  Order ID
                </TableHead>

                <TableHead>
                  Customer
                </TableHead>

                <TableHead>
                  Amount
                </TableHead>

                <TableHead>
                  Gateway
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Date
                </TableHead>

                <TableHead className="text-right">
                  Action
                </TableHead>

              </TableRow>
            </TableHeader>


            <TableBody>

              {payments.length === 0 ? (

                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-gray-500"
                  >
                    No payments found
                  </TableCell>
                </TableRow>

              ) : (

                payments.map(
                  (payment) => (

                    <TableRow
                      key={payment._id}
                    >

                      {/* PAYMENT ID */}

                      <TableCell>
                        <span
                          className="block max-w-[130px] truncate font-medium"
                          title={payment._id}
                        >
                          {payment._id}
                        </span>
                      </TableCell>


                      {/* ORDER ID */}

                      <TableCell>
                        <span className="font-medium">
                          {payment.order?.orderId ||
                            payment.order?._id ||
                            "-"}
                        </span>
                      </TableCell>


                      {/* CUSTOMER */}

                      <TableCell>
                        <div className="flex items-center gap-3">

                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100">

                            {payment.user
                              ?.profileImage ? (

                              <img
                                src={
                                  payment.user
                                    .profileImage
                                }
                                alt={
                                  payment.user
                                    .name ||
                                  "Customer"
                                }
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-500">
                                {payment.user
                                  ?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}
                              </div>

                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-medium">
                              {payment.user
                                ?.name ||
                                "Unknown"}
                            </p>

                            <p className="max-w-[180px] truncate text-xs text-gray-500">
                              {payment.user
                                ?.email ||
                                "-"}
                            </p>

                          </div>

                        </div>
                      </TableCell>


                      {/* AMOUNT */}

                      <TableCell>
                        <span className="font-medium">
                          {formatAmount(
                            payment.amount,
                            payment.currency
                          )}
                        </span>
                      </TableCell>


                      {/* GATEWAY */}

                      <TableCell>
                        <span className="capitalize">
                          {payment.paymentGateway}
                        </span>
                      </TableCell>


                      {/* STATUS */}

                      <TableCell>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>

                      </TableCell>


                      {/* DATE */}

                      <TableCell>
                        {formatDate(
                          payment.createdAt
                        )}
                      </TableCell>


                      {/* ACTION */}

                      <TableCell>
                        <div className="flex justify-end">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/payments/${payment._id}`
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                          >
                            <Eye
                              size={15}
                            />

                            View
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

        {payments.length === 0 ? (

          <CardBox>
            <div className="py-8 text-center text-gray-500">
              No payments found
            </div>
          </CardBox>

        ) : (

          payments.map(
            (payment) => (

              <CardBox
                key={payment._id}
              >

                {/* CUSTOMER */}

                <div className="flex items-center justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">

                      {payment.user
                        ?.profileImage ? (

                        <img
                          src={
                            payment.user
                              .profileImage
                          }
                          alt={
                            payment.user
                              .name ||
                            "Customer"
                          }
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                          {payment.user
                            ?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                        </div>

                      )}

                    </div>

                    <div className="min-w-0">

                      <p className="truncate font-semibold">
                        {payment.user
                          ?.name ||
                          "Unknown customer"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {payment.user
                          ?.email ||
                          "-"}
                      </p>

                    </div>

                  </div>


                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </span>

                </div>


                {/* INFO */}

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">

                  <div>
                    <p className="text-xs text-gray-500">
                      Payment ID
                    </p>

                    <p
                      className="mt-1 truncate text-sm font-medium"
                      title={payment._id}
                    >
                      {payment._id}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 truncate text-sm font-medium">
                      {payment.order
                        ?.orderId ||
                        payment.order
                          ?._id ||
                        "-"}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-gray-500">
                      Amount
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatAmount(
                        payment.amount,
                        payment.currency
                      )}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-gray-500">
                      Gateway
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize">
                      {payment.paymentGateway}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-gray-500">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatDate(
                        payment.createdAt
                      )}
                    </p>
                  </div>

                </div>


                {/* VIEW */}

                <div className="mt-4 border-t border-gray-100 pt-4">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/payments/${payment._id}`
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    <Eye size={16} />

                    View Payment
                  </button>

                </div>

              </CardBox>

            )
          )
        )}

      </div>

    </div>
  );
};

export default Payments;