import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Category {
  _id: string;
  name?: string;
}

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  category?: Category | null;
  displayOrder?: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

const BannerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [banner, setBanner] =
    useState<Banner | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [deleting, setDeleting] =
    useState(false);

  // =========================================================
  // FETCH BANNER
  // =========================================================

  const fetchBanner = async () => {
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

      if (!id) {
        toast.error(
          "Banner ID is missing"
        );
        return;
      }

      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/banner/admin`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const banners =
        response.data?.banners || [];

      const foundBanner =
        banners.find(
          (item: Banner) =>
            item._id === id
        );

      if (!foundBanner) {
        toast.error(
          "Banner not found"
        );

        navigate(
          "/banners"
        );

        return;
      }

      setBanner(foundBanner);

    } catch (error: unknown) {
      console.error(
        "Fetch banner error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch banner";

      toast.error(
        message ||
          "Failed to fetch banner"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [id]);

  // =========================================================
  // DELETE
  // =========================================================

  const deleteBanner = async () => {
    if (!banner) return;

    try {
      setDeleting(true);

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
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/banner/admin/${banner._id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      toast.success(
        response.data?.message ||
          "Banner deleted successfully"
      );

      navigate(
        "/banners"
      );

    } catch (error: unknown) {
      console.error(
        "Delete banner error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to delete banner";

      toast.error(
        message ||
          "Failed to delete banner"
      );

    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // DELETE CONFIRMATION
  // =========================================================

  const handleDelete = () => {
    toast(
      "Are you sure you want to delete this banner?",
      {
        action: {
          label: "Delete",
          onClick: () =>
            deleteBanner(),
        },

        cancel: {
          label: "Cancel",
          onClick: () => {},
        },

        duration: 8000,
      }
    );
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleString(
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
      <CardBox>
        <div className="py-12 text-center text-gray-500">
          Loading banner...
        </div>
      </CardBox>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!banner) {
    return (
      <CardBox>
        <div className="py-12 text-center">

          <p className="mb-4 text-gray-500">
            Banner not found
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/banners"
              )
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Back to Banners
          </button>

        </div>
      </CardBox>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/banners"
            )
          }
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          Back to Banners
        </button>


        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-semibold">
              Banner Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View complete banner information
            </p>

          </div>


          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/banners/edit/${banner._id}`
                )
              }
              className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
            >
              <Pencil size={15} />
              Edit
            </button>


            <button
              type="button"
              disabled={deleting}
              onClick={
                handleDelete
              }
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              <Trash2 size={15} />

              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>

          </div>

        </div>

      </div>


      {/* IMAGE */}

      <CardBox>

        <h5 className="mb-5 text-lg font-semibold">
          Banner Image
        </h5>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">

          <img
            src={banner.image}
            alt={banner.title}
            className="max-h-[500px] w-full object-cover"
          />

        </div>

      </CardBox>


      {/* INFORMATION */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* CONTENT */}

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Banner Content
          </h5>

          <div className="space-y-5">

            <div>

              <p className="text-sm text-gray-500">
                Title
              </p>

              <p className="mt-1 font-medium">
                {banner.title}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Subtitle
              </p>

              <p className="mt-1 leading-6 text-gray-700">
                {banner.subtitle ||
                  "-"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Button Text
              </p>

              <p className="mt-1 font-medium">
                {banner.buttonText ||
                  "-"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Button Link
              </p>

              <p className="mt-1 break-all font-medium">
                {banner.buttonLink ||
                  "-"}
              </p>

            </div>

          </div>

        </CardBox>


        {/* SETTINGS */}

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Banner Settings
          </h5>

          <div className="space-y-5">

            <div>

              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="mt-1 font-medium">
                {banner.category
                  ?.name ||
                  "-"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Display Order
              </p>

              <p className="mt-1 font-medium">
                {banner.displayOrder ??
                  0}
              </p>

            </div>


            <div>

              <p className="mb-1 text-sm text-gray-500">
                Status
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  banner.status ===
                  "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {banner.status ===
                "active"
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Created At
              </p>

              <p className="mt-1 font-medium">
                {formatDate(
                  banner.createdAt
                )}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Last Updated
              </p>

              <p className="mt-1 font-medium">
                {formatDate(
                  banner.updatedAt
                )}
              </p>

            </div>

          </div>

        </CardBox>

      </div>

    </div>
  );
};

export default BannerDetails;