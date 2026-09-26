import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import CardBox from "../../components/shared/CardBox";

const AddCustomer = () => {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "India",
    preferredcurrency: "INR",
    isActive: true,
  });

  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

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

    if (!formData.password) {
      toast.error(
        "Password is required"
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
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

      data.append(
        "password",
        formData.password
      );

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
        String(formData.isActive)
      );

      if (image) {
        data.append(
          "profileImage",
          image
        );
      }

      const response =
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/admin/customers`,
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
          "Customer created successfully"
      );

      navigate(
        "/ostik-admin/customers"
      );

    } catch (error: unknown) {

      console.error(
        "Create customer error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to create customer";

      toast.error(
        message ||
          "Failed to create customer"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div>

      <div className="mb-6">

        <h2 className="text-2xl font-semibold">
          Add Customer
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Create a new customer account
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
                  placeholder="Enter customer name"
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
                  placeholder="customer@example.com"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={
                    formData.password
                  }
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />

              </div>

              {/* COUNTRY */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Country
                </label>

                <input
                  name="country"
                  value={formData.country}
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
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-3"
            />

            {preview && (

              <div className="mt-4">

                <div className="h-32 w-32 rounded-full overflow-hidden border border-gray-200 bg-gray-50">

                  <img
                    src={preview}
                    alt="Preview"
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
                ? "Creating..."
                : "Create Customer"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/ostik-admin/customers"
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

export default AddCustomer;