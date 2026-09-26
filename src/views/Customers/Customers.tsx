import { useEffect, useState } from "react";
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

interface Customer {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  country?: string;
  preferredcurrency?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt?: string;
}

// =========================================================
// COMPONENT
// =========================================================

const Customers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [statusLoadingId, setStatusLoadingId] =
    useState<string | null>(null);

  // =========================================================
  // FETCH CUSTOMERS
  // =========================================================

  const fetchCustomers = async () => {
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
        `${import.meta.env.VITE_API_URL}/api/user/admin/customers`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          }
        }
      );

      console.log(
        "Customers response:",
        response.data
      );

      setCustomers(
        response.data?.customers || []
      );

    } catch (error: unknown) {

      console.error(
        "Fetch customers error:",
        error
      );

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to fetch customers";

      toast.error(
        message || "Failed to fetch customers"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================================================
  // TOGGLE CUSTOMER STATUS
  // =========================================================

  const toggleCustomerStatus = async (
    customerId: string
  ) => {

    try {

      setStatusLoadingId(customerId);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error(
          "Admin authentication required"
        );
        return;
      }

      const response =
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/user/admin/customers/${customerId}/toggle-status`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      toast.success(
        response.data?.message ||
          "Customer status updated"
      );

      setCustomers(
        (previousCustomers) =>
          previousCustomers.map(
            (customer) =>
              customer._id === customerId
                ? {
                    ...customer,
                    isActive:
                      response.data
                        ?.isActive
                  }
                : customer
          )
      );

    } catch (error: unknown) {

      console.error(
        "Toggle customer status error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to update customer status";

      toast.error(
        message ||
          "Failed to update customer status"
      );

    } finally {
      setStatusLoadingId(null);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (
    date?: string
  ) => {

    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div>

      {/* PAGE HEADER */}

      <div className="mb-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Customers
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage customers in your store
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/ostik-admin/customers/add"
              )
            }
            className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            Add Customer
          </button>

        </div>

      </div>

      {/* CUSTOMER TABLE */}

      <CardBox>

        <div className="mb-5">

          <h5 className="text-lg font-semibold">
            Customer List
          </h5>

          <p className="text-sm text-gray-500">
            View and manage registered customers
          </p>

        </div>

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Customer
              </TableHead>

              <TableHead>
                Country
              </TableHead>

              <TableHead>
                Currency
              </TableHead>

              <TableHead>
                Verification
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Joined
              </TableHead>

              <TableHead>
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {loading ? (

              <TableRow>

                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  Loading customers...
                </TableCell>

              </TableRow>

            ) : customers.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  No customers found
                </TableCell>

              </TableRow>

            ) : (

              customers.map(
                (customer) => (

                  <TableRow
                    key={customer._id}
                  >

                    {/* CUSTOMER */}

                    <TableCell>

                      <div className="flex items-center gap-3">

                        <div className="h-11 w-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">

                          {customer.profileImage ? (

                            <img
                              src={
                                customer.profileImage
                              }
                              alt={
                                customer.name
                              }
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />

                          ) : (

                            <div className="h-full w-full flex items-center justify-center text-sm font-medium text-gray-500">
                              {customer.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>

                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="font-medium text-gray-800 truncate max-w-[220px]">
                            {customer.name}
                          </p>

                          <p className="text-xs text-gray-500 mt-1 truncate max-w-[220px]">
                            {customer.email}
                          </p>

                        </div>

                      </div>

                    </TableCell>

                    {/* COUNTRY */}

                    <TableCell>
                      {customer.country ||
                        "-"}
                    </TableCell>

                    {/* CURRENCY */}

                    <TableCell>
                      {customer.preferredcurrency ||
                        "INR"}
                    </TableCell>

                    {/* VERIFICATION */}

                    <TableCell>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customer.isEmailVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {customer.isEmailVerified
                          ? "Verified"
                          : "Unverified"}
                      </span>

                    </TableCell>

                    {/* STATUS */}

                    <TableCell>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customer.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {customer.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </TableCell>

                    {/* JOINED */}

                    <TableCell>
                      {formatDate(
                        customer.createdAt
                      )}
                    </TableCell>

                    {/* ACTIONS */}

                    <TableCell>

                      <div className="flex items-center gap-3">

                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/ostik-admin/customers/${customer._id}`
                            )
                          }
                          className="text-primary hover:underline font-medium"
                        >
                          View
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/ostik-admin/customers/edit/${customer._id}`
                            )
                          }
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Edit
                        </button>

                        {/* ACTIVATE / DEACTIVATE */}

                        <button
                          type="button"
                          disabled={
                            statusLoadingId ===
                            customer._id
                          }
                          onClick={() =>
                            toggleCustomerStatus(
                              customer._id
                            )
                          }
                          className="text-orange-600 hover:underline font-medium disabled:opacity-50"
                        >
                          {statusLoadingId ===
                          customer._id
                            ? "Updating..."
                            : customer.isActive
                            ? "Deactivate"
                            : "Activate"}
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
  );
};

export default Customers;