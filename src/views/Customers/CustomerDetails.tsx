import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Address {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  country?: string;
  preferredcurrency?: string;
  addresses?: Address[];
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const CustomerDetails = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // FETCH CUSTOMER
  // =========================================================

  useEffect(() => {

    const fetchCustomer = async () => {

      if (!id) {
        return;
      }

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "adminToken"
          );

        if (!token) {
          toast.error(
            "Admin authentication required"
          );
          return;
        }

        const response =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/user/admin/customers/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setCustomer(
          response.data?.customer ||
            null
        );

      } catch (error: unknown) {

        console.error(
          "Fetch customer error:",
          error
        );

        const message =
          axios.isAxiosError(error)
            ? error.response?.data?.message
            : "Failed to fetch customer";

        toast.error(
          message ||
            "Failed to fetch customer"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();

  }, [id]);

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
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <CardBox>
        <div className="py-12 text-center text-gray-500">
          Loading customer...
        </div>
      </CardBox>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!customer) {

    return (
      <CardBox>

        <div className="py-12 text-center">

          <p className="text-gray-500 mb-4">
            Customer not found
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/customers"
              )
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Back to Customers
          </button>

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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Customer Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View customer information
            </p>
          </div>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/customers/edit/${customer._id}`
                )
              }
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Edit Customer
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/customers"
                )
              }
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
            >
              Back
            </button>

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROFILE */}

        <CardBox>

          <div className="flex flex-col items-center text-center">

            <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border border-gray-200 mb-4">

              {customer.profileImage ? (

                <img
                  src={
                    customer.profileImage
                  }
                  alt={
                    customer.name
                  }
                  className="h-full w-full object-cover"
                />

              ) : (

                <div className="h-full w-full flex items-center justify-center text-3xl font-semibold text-gray-400">
                  {customer.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

              )}

            </div>

            <h3 className="text-xl font-semibold">
              {customer.name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {customer.email}
            </p>

            <div className="flex gap-2 mt-4">

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

            </div>

          </div>

        </CardBox>

        {/* INFORMATION */}

        <CardBox className="lg:col-span-2">

          <h5 className="text-lg font-semibold mb-6">
            Customer Information
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Name
              </p>
              <p className="font-medium">
                {customer.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Email
              </p>
              <p className="font-medium break-all">
                {customer.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Country
              </p>
              <p className="font-medium">
                {customer.country ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Preferred Currency
              </p>
              <p className="font-medium">
                {customer.preferredcurrency ||
                  "INR"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Joined
              </p>
              <p className="font-medium">
                {formatDate(
                  customer.createdAt
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Last Updated
              </p>
              <p className="font-medium">
                {formatDate(
                  customer.updatedAt
                )}
              </p>
            </div>

          </div>

        </CardBox>

      </div>

      {/* ADDRESSES */}

      <div className="mt-6">

        <CardBox>

          <h5 className="text-lg font-semibold mb-5">
            Saved Addresses
          </h5>

          {!customer.addresses ||
          customer.addresses.length === 0 ? (

            <div className="py-8 text-center text-gray-500">
              No saved addresses
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {customer.addresses.map(
                (address, index) => (

                  <div
                    key={
                      address._id ||
                      index
                    }
                    className="rounded-lg border border-gray-200 p-5"
                  >

                    <p className="font-semibold text-gray-800">
                      {address.name ||
                        "Address"}
                    </p>

                    {address.phone && (
                      <p className="text-sm text-gray-600 mt-2">
                        {address.phone}
                      </p>
                    )}

                    {address.email && (
                      <p className="text-sm text-gray-600 mt-1">
                        {address.email}
                      </p>
                    )}

                    {address.address && (
                      <p className="text-sm text-gray-600 mt-3">
                        {address.address}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 mt-1">
                      {address.city &&
                        `${address.city}`}
                      {address.pincode &&
                        ` - ${address.pincode}`}
                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </CardBox>

      </div>

    </div>
  );
};

export default CustomerDetails;