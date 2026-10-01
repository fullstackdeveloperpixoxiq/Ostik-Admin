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

interface ReturnUser {
  _id?: string;
  name?: string;
  email?: string;
}

interface ReturnItem {
  name?: string;
  image?: string;
}

interface ReturnRequest {
  _id: string;

  user?: ReturnUser;

  item?: ReturnItem;

  order?: {
    _id?: string;
    total?: number;
    orderStatus?: string;
    placedAt?: string;
  };

  reason?: string;
  comment?: string;

  status?:
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Picked Up"
    | "Received"
    | "Refunded"
    | "Cancelled";

  requestedAt?: string;
  approvedAt?: string | null;
  completedAt?: string | null;
  adminComment?: string;
  createdAt?: string;
}

// =========================================================
// STATUS
// =========================================================

type ReturnStatus =
  | "All"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Picked Up"
  | "Received"
  | "Refunded"
  | "Cancelled";

// =========================================================
// COMPONENT
// =========================================================

const Returns = () => {
  const navigate = useNavigate();

  const [returns, setReturns] = useState<
    ReturnRequest[]
  >([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [statusFilter, setStatusFilter] =
    useState<ReturnStatus>("All");

  // =========================================================
  // FETCH RETURNS
  // =========================================================

  const fetchReturns = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error(
          "Admin authentication required"
        );

        navigate("/login");

        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/return/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReturns(
        response.data?.returns || []
      );
    } catch (error) {
      console.error(
        "Fetch returns error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch return requests";

      toast.error(
        message ||
          "Failed to fetch return requests"
      );

      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        navigate(
          "/login"
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
    fetchReturns();
  }, []);

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusClass = (
    status?: ReturnRequest["status"]
  ): string => {
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
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const statusFilters: ReturnStatus[] = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
    "Picked Up",
    "Received",
    "Refunded",
    "Cancelled",
  ];

  // =========================================================
  // STATUS COUNT
  // =========================================================

  const getStatusCount = (
    status: ReturnStatus
  ): number => {
    if (status === "All") {
      return returns.length;
    }

    return returns.filter(
      (returnRequest) =>
        returnRequest.status === status
    ).length;
  };

  // =========================================================
  // FILTERED RETURNS
  // =========================================================

  const filteredReturns = useMemo(() => {
    if (statusFilter === "All") {
      return returns;
    }

    return returns.filter(
      (returnRequest) =>
        returnRequest.status === statusFilter
    );
  }, [returns, statusFilter]);

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
          Returns
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer product return requests
        </p>

      </div>


      {/* =====================================================
          RETURN CARD
      ====================================================== */}

      <CardBox>

        {/* =================================================
            CARD HEADER
        ================================================== */}

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h5 className="text-lg font-semibold">
              Return List
            </h5>

            <p className="text-sm text-gray-500">
              View and manage return requests
            </p>

          </div>

          <p className="text-sm text-gray-500">

            Total{" "}

            <span className="font-semibold text-gray-800">
              {returns.length}
            </span>

          </p>

        </div>


        {/* =================================================
            STATUS FILTERS
        ================================================== */}

        <div className="mb-5 flex flex-wrap gap-2">

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
                Return
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
                  className="py-10 text-center text-gray-500"
                >
                  Loading return requests...
                </TableCell>

              </TableRow>

            ) : filteredReturns.length === 0 ? (

              /* EMPTY */

              <TableRow>

                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-gray-500"
                >

                  {statusFilter ===
                  "All"
                    ? "No return requests found"
                    : `No ${statusFilter.toLowerCase()} return requests found`}

                </TableCell>

              </TableRow>

            ) : (

              /* RETURNS */

              filteredReturns.map(
                (returnRequest) => {

                  const productImage =
                    returnRequest.item?.image;

                  return (
                    <TableRow
                      key={returnRequest._id}
                    >

                      {/* =================================
                          RETURN
                      ================================== */}

                      <TableCell>

                        <div>

                          <p className="font-medium text-gray-800">
                            #
                            {returnRequest._id
                              ?.slice(-8)
                              .toUpperCase()}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Order #
                            {returnRequest.order?._id
                              ?.slice(-8)
                              .toUpperCase() ||
                              "-"}
                          </p>

                        </div>

                      </TableCell>


                      {/* =================================
                          CUSTOMER
                      ================================== */}

                      <TableCell>

                        <div>

                          <p className="font-medium text-gray-800">
                            {returnRequest.user
                              ?.name ||
                              "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {returnRequest.user
                              ?.email ||
                              "-"}
                          </p>

                        </div>

                      </TableCell>


                      {/* =================================
                          PRODUCT
                      ================================== */}

                      <TableCell>

                        <div className="flex items-center gap-3">

                          {/* IMAGE */}

                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">

                            {productImage ? (

                              <img
                                src={
                                  productImage
                                }
                                alt={
                                  returnRequest
                                    .item
                                    ?.name ||
                                  "Product"
                                }
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                No image
                              </div>

                            )}

                          </div>


                          {/* NAME */}

                          <p className="font-medium text-gray-800">
                            {returnRequest
                              .item?.name ||
                              "-"}
                          </p>

                        </div>

                      </TableCell>


                      {/* =================================
                          STATUS
                      ================================== */}

                      <TableCell>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            returnRequest.status
                          )}`}
                        >
                          {
                            returnRequest.status ||
                            "-"
                          }
                        </span>

                      </TableCell>


                      {/* =================================
                          ACTION
                      ================================== */}

                      <TableCell>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/returns/${returnRequest._id}`
                            )
                          }
                          className="font-medium text-primary hover:underline"
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
          returns.length > 0 && (
            <p className="mt-4 text-xs text-gray-400">
              Showing{" "}
              {filteredReturns.length} of{" "}
              {returns.length} return requests
            </p>
          )}

      </CardBox>

    </div>
  );
};

export default Returns;