import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import CardBox from "../../components/shared/CardBox";

const EditCustomer = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const [pageLoading, setPageLoading] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      country: "India",
      preferredcurrency: "INR",
      isActive: true,
    });

  const [existingImage, setExistingImage] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  // =========================================================
  // FETCH CUSTOMER
  // =========================================================

  useEffect(() => {

    const fetchCustomer = async () => {

      if (!id) {
        return;
      }

      try {

        setPageLoading(true);

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

        const customer =
          response.data?.customer;

        if (!customer) {
          toast.error(
            "Customer not found"
          );

          navigate(
            "/ostik-admin/customers"
          );

          return;
        }

        setFormData({
          name: customer.name || "",
          email: customer.email || "",
          password: "",
          country:
            customer.country ||
            "India",
          preferredcurrency:
            customer.preferredcurrency ||
            "INR",
          isActive:
            customer.isActive ??
            true,
        });

        setExistingImage(
          customer.profileImage || ""
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
        setPageLoading(false);
      }
    };

    fetchCustomer();

  }, [id, navigate]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {

    const { name, value, type } =
      e.target;

    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement)
            .checked
        : undefined;

    setFormData(
      (previous) => ({
        ...previous,
        [name]:
          type === "checkbox"
            ? checked
            : value
      })
    );
  };

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      toast.error(
        "Please select a valid image"
      );
      return;
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (!id) {
      return;
    }

    if (!formData.name.trim()) {
      toast.error(
        "Customer name is required"
      );
      return;
    }

    if (!formData.email.trim()) {
      toast.error(
        "Customer email is required"
      );
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

      const data =
        new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "email",
        formData.email
          .trim()
          .toLowerCase()
      );

      if (
        formData.password.trim()
      ) {
        data.append(
          "password",
          formData.password
        );
      }

      data.append(
        "country",
        formData.country
      );

      data.append(
        "preferredcurrency",
        formData.preferredcurrency
      );

      data.append(
        "isActive",
        String(
          formData.isActive
        )
      );

      if (image) {
        data.append(
          "profileImage",
          image
        );
      }

      const response =
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/user/admin/customers/${id}`,
          data,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      toast.success(
        response.data?.message ||
          "Customer updated successfully"
      );

      navigate(
        `/ostik-admin/customers/${id}`
      );

    } catch (error: unknown) {

      console.error(
        "Update customer error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to update customer";

      toast.error(
        message ||
          "Failed to update customer"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (pageLoading) {

    return (
      <CardBox>
        <div className="py-12 text-center text-gray-500">
          Loading customer...
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
          Edit Customer
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Update customer information
        </p>

      </div>

      <CardBox>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* BASIC INFORMATION */}

          <div>

            <h5 className="text-lg font-semibold mb-4">
              Customer Information
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave empty to keep current password"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Leave empty if password should not
                  be changed.
                </p>

              </div>

              {/* COUNTRY */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Country
                </label>

                <input
                  name="country"
                  value={
                    formData.country
                  }
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />

              </div>

              {/* CURRENCY */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Preferred Currency
                </label>

                <select
                  name="preferredcurrency"
                  value={
                    formData.preferredcurrency
                  }
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="INR">
                    INR
                  </option>

                  <option value="USD">
                    USD
                  </option>

                  <option value="EUR">
                    EUR
                  </option>

                  <option value="GBP">
                    GBP
                  </option>
                </select>

              </div>

            </div>

          </div>

          {/* PROFILE IMAGE */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Profile Image
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={
                handleImageChange
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-3"
            />

            <p className="text-xs text-gray-500 mt-2">
              Select a new image only if you want
              to replace the current image.
            </p>

            {(preview ||
              existingImage) && (

              <div className="mt-4">

                <div className="h-32 w-32 rounded-full overflow-hidden border border-gray-200 bg-gray-50">

                  <img
                    src={
                      preview ||
                      existingImage
                    }
                    alt={
                      formData.name
                    }
                    className="h-full w-full object-cover"
                  />

                </div>

              </div>

            )}

          </div>

          {/* STATUS */}

          <div>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="isActive"
                checked={
                  formData.isActive
                }
                onChange={handleChange}
                className="h-4 w-4"
              />

              <span className="text-sm">
                Active Customer
              </span>

            </label>

          </div>

          {/* ACTIONS */}

          <div className="flex gap-3 pt-3">

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-5 py-3 text-white font-medium disabled:opacity-50"
            >
              {loading
                ? "Updating..."
                : "Update Customer"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/ostik-admin/customers/${id}`
                )
              }
              className="rounded-md border border-gray-300 px-5 py-3 font-medium"
            >
              Cancel
            </button>

          </div>

        </form>

      </CardBox>

    </div>
  );
};

export default EditCustomer;