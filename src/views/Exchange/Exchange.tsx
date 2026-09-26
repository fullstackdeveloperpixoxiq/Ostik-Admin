import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import CardBox from "../../components/shared/CardBox";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";

// =========================================================
// TYPES
// =========================================================

interface ExchangeUser {
  _id?: string;
  name?: string;
  email?: string;
}

interface ExchangeItem {
  name?: string;
  image?: string;
}

interface ExchangeRequest {
  _id: string;
  user?: ExchangeUser;
  item?: ExchangeItem;

  status?:
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Pickup Scheduled"
    | "Received"
    | "Replacement Shipped"
    | "Completed"
    | "Cancelled";

  createdAt?: string;
}

// =========================================================
// STATUS
// =========================================================

type ExchangeStatus =
  | "All"
  | "Pending"
  | "Approved"
  | "Pickup Scheduled"
  | "Received"
  | "Replacement Shipped"
  | "Completed"
  | "Rejected"
  | "Cancelled";

// =========================================================
// COMPONENT
// =========================================================

const Exchange = () => {
  const navigate = useNavigate();

  const [exchanges, setExchanges] = useState<
    ExchangeRequest[]
  >([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [statusFilter, setStatusFilter] =
    useState<ExchangeStatus>("All");

  // =========================================================
  // FETCH EXCHANGES
  // =========================================================

  const fetchExchanges = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error(
          "Admin authentication required"
        );

        navigate("/ostik-admin/login");

        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/exchange/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExchanges(
        response.data?.exchanges || []
      );
    } catch (error) {
      console.error(
        "Fetch exchanges error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch exchange requests";

      toast.error(
        message ||
          "Failed to fetch exchange requests"
      );

      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        navigate(
          "/ostik-admin/login"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchExchanges();
  }, []);

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusClass = (
    status?: ExchangeRequest["status"]
  ): string => {
    switch (status) {
      case "Approved":
        return "bg-blue-100 text-blue-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Pickup Scheduled":
        return "bg-purple-100 text-purple-700";

      case "Received":
        return "bg-indigo-100 text-indigo-700";

      case "Replacement Shipped":
        return "bg-cyan-100 text-cyan-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const statusFilters: ExchangeStatus[] = [
    "All",
    "Pending",
    "Approved",
    "Pickup Scheduled",
    "Received",
    "Replacement Shipped",
    "Completed",
    "Rejected",
    "Cancelled",
  ];

  // =========================================================
  // FILTER COUNT
  // =========================================================

  const getStatusCount = (
    status: ExchangeStatus
  ): number => {
    if (status === "All") {
      return exchanges.length;
    }

    return exchanges.filter(
      (exchange) =>
        exchange.status === status
    ).length;
  };

  // =========================================================
  // FILTERED EXCHANGES
  // =========================================================

  const filteredExchanges = useMemo(() => {
    if (statusFilter === "All") {
      return exchanges;
    }

    return exchanges.filter(
      (exchange) =>
        exchange.status === statusFilter
    );
  }, [exchanges, statusFilter]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div>

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Exchanges
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage customer product exchange requests
        </p>
      </div>


      {/* =====================================================
          EXCHANGE CARD
      ====================================================== */}

      <CardBox>

        {/* HEADER */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">

          <div>
            <h5 className="text-lg font-semibold">
              Exchange List
            </h5>

            <p className="text-sm text-gray-500">
              View and manage exchange requests
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Total{" "}
            <span className="font-semibold text-gray-800">
              {exchanges.length}
            </span>
          </p>

        </div>


        {/* =================================================
            STATUS FILTERS
        ================================================== */}

        <div className="flex flex-wrap gap-2 mb-5">

          {statusFilters.map(
            (status) => {

              const count =
                getStatusCount(status);

              const isActive =
                statusFilter === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`rounded-md px-3 py-2 text-xs font-medium transition sm:text-sm ${
                    isActive
                      ? "bg-primary text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {status}{" "}
                  <span
                    className={
                      isActive
                        ? "opacity-80"
                        : "text-gray-400"
                    }
                  >
                    ({count})
                  </span>
                </button>
              );
            }
          )}

        </div>


        {/* =================================================
            TABLE
        ================================================== */}

        <Table>

          {/* TABLE HEADER */}

          <TableHeader>

            <TableRow>

              <TableHead>
                Exchange
              </TableHead>

              <TableHead>
                Customer
              </TableHead>

              <TableHead>
                Product
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>


          {/* TABLE BODY */}

          <TableBody>

            {/* LOADING */}

            {loading ? (

              <TableRow>

                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  Loading exchange requests...
                </TableCell>

              </TableRow>

            ) : filteredExchanges.length === 0 ? (

              /* EMPTY */

              <TableRow>

                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  {statusFilter === "All"
                    ? "No exchange requests found"
                    : `No ${statusFilter.toLowerCase()} exchange requests found`}
                </TableCell>

              </TableRow>

            ) : (

              /* EXCHANGES */

              filteredExchanges.map(
                (exchange) => {

                  const productImage =
                    exchange.item?.image;

                  return (
                    <TableRow
                      key={exchange._id}
                    >

                      {/* =================================
                          EXCHANGE
                      ================================== */}

                      <TableCell>

                        <div>

                          <p className="font-medium text-gray-800">
                            #
                            {exchange._id
                              ?.slice(-8)
                              .toUpperCase()}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {exchange.createdAt
                              ? new Date(
                                  exchange.createdAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "-"}
                          </p>

                        </div>

                      </TableCell>


                      {/* =================================
                          CUSTOMER
                      ================================== */}

                      <TableCell>

                        <div>

                          <p className="font-medium text-gray-800">
                            {exchange.user?.name ||
                              "Unknown"}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {exchange.user?.email ||
                              "-"}
                          </p>

                        </div>

                      </TableCell>


                      {/* =================================
                          PRODUCT
                      ================================== */}

                      <TableCell>

                        <div className="flex items-center gap-3">

                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">

                            {productImage ? (

                              <img
                                src={productImage}
                                alt={
                                  exchange.item
                                    ?.name ||
                                  "Product"
                                }
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                                No image
                              </div>

                            )}

                          </div>

                          <p className="font-medium text-gray-800">
                            {exchange.item?.name ||
                              "-"}
                          </p>

                        </div>

                      </TableCell>


                      {/* =================================
                          STATUS
                      ================================== */}

                      <TableCell>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            exchange.status
                          )}`}
                        >
                          {exchange.status ||
                            "-"}
                        </span>

                      </TableCell>


                      {/* =================================
                          ACTIONS
                      ================================== */}

                      <TableCell>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/ostik-admin/exchanges/${exchange._id}`
                            )
                          }
                          className="text-primary hover:underline font-medium"
                        >
                          View
                        </button>

                      </TableCell>

                    </TableRow>
                  );
                }
              )

            )}

          </TableBody>

        </Table>


        {/* =================================================
            RESULT COUNT
        ================================================== */}

        {!loading &&
          exchanges.length > 0 && (
            <p className="mt-4 text-xs text-gray-400">
              Showing{" "}
              {filteredExchanges.length} of{" "}
              {exchanges.length} exchange requests
            </p>
          )}

      </CardBox>

    </div>
  );
};

export default Exchange;