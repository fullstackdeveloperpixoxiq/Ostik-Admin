import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
}

const Banners = () => {
  const navigate = useNavigate();

  const [banners, setBanners] =
    useState<Banner[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [deleting, setDeleting] =
    useState<boolean>(false);

  // =========================================================
  // FETCH BANNERS
  // =========================================================

  const fetchBanners = async () => {
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
        `${import.meta.env.VITE_API_URL}/api/banner/admin`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setBanners(
        response.data?.banners || []
      );
    } catch (error: unknown) {
      console.error(
        "Fetch banners error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch banners";

      toast.error(
        message ||
          "Failed to fetch banners"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // =========================================================
  // DELETE BANNER
  // =========================================================

  const deleteBanner = async (
    id: string
  ) => {
    try {
      setDeleting(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error(
          "Admin authentication required"
        );
        return;
      }

      const response =
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/banner/admin/${id}`,
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

      setBanners((prev) =>
        prev.filter(
          (banner) =>
            banner._id !== id
        )
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

  const handleDelete = (
    id: string
  ) => {
    toast(
      "Are you sure you want to delete this banner?",
      {
        action: {
          label: "Delete",
          onClick: () =>
            deleteBanner(id),
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
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <CardBox>
        <div className="py-12 text-center text-gray-500">
          Loading banners...
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
              Banners
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage homepage banners
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/banners/add"
              )
            }
            className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Add Banner
          </button>

        </div>

      </div>


      {/* DESKTOP TABLE */}

      <div className="hidden md:block">

        <CardBox className="overflow-hidden p-0">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Banner
                </TableHead>

                <TableHead>
                  Category
                </TableHead>

                <TableHead>
                  Display Order
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Date
                </TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {banners.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-gray-500"
                  >
                    No banners found
                  </TableCell>

                </TableRow>

              ) : (

                banners.map(
                  (banner) => (

                    <TableRow
                      key={banner._id}
                    >

                      {/* BANNER */}

                      <TableCell>

                        <div className="flex items-center gap-3">

                          <div className="h-12 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">

                            <img
                              src={
                                banner.image
                              }
                              alt={
                                banner.title
                              }
                              className="h-full w-full object-cover"
                            />

                          </div>

                          <div className="min-w-0">

                            <p className="max-w-[220px] truncate font-medium">
                              {banner.title}
                            </p>

                            {banner.subtitle && (
                              <p className="max-w-[220px] truncate text-xs text-gray-500">
                                {banner.subtitle}
                              </p>
                            )}

                          </div>

                        </div>

                      </TableCell>


                      {/* CATEGORY */}

                      <TableCell>

                        {banner.category?.name ||
                          "-"}

                      </TableCell>


                      {/* DISPLAY ORDER */}

                      <TableCell>

                        {banner.displayOrder ??
                          0}

                      </TableCell>


                      {/* STATUS */}

                      <TableCell>

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

                      </TableCell>


                      {/* DATE */}

                      <TableCell>

                        {formatDate(
                          banner.createdAt
                        )}

                      </TableCell>


                      {/* ACTIONS */}

                      <TableCell>

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/banners/${banner._id}`
                              )
                            }
                            className="rounded-md border border-gray-300 p-2 hover:bg-gray-50"
                            title="View"
                          >
                            <Eye
                              size={16}
                            />
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/banners/edit/${banner._id}`
                              )
                            }
                            className="rounded-md border border-gray-300 p-2 hover:bg-gray-50"
                            title="Edit"
                          >
                            <Pencil
                              size={16}
                            />
                          </button>


                          <button
                            type="button"
                            disabled={
                              deleting
                            }
                            onClick={() =>
                              handleDelete(
                                banner._id
                              )
                            }
                            className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2
                              size={16}
                            />
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

        {banners.length === 0 ? (

          <CardBox>

            <div className="py-8 text-center text-gray-500">
              No banners found
            </div>

          </CardBox>

        ) : (

          banners.map(
            (banner) => (

              <CardBox
                key={banner._id}
              >

                {/* IMAGE */}

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">

                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="h-40 w-full object-cover"
                  />

                </div>


                {/* TITLE */}

                <div className="mt-4">

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <h3 className="truncate font-semibold">
                        {banner.title}
                      </h3>

                      {banner.subtitle && (
                        <p className="mt-1 text-sm text-gray-500">
                          {banner.subtitle}
                        </p>
                      )}

                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
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

                </div>


                {/* INFO */}

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">

                  <div>

                    <p className="text-xs text-gray-500">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {banner.category
                        ?.name || "-"}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500">
                      Display Order
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {banner.displayOrder ??
                        0}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500">
                      Button
                    </p>

                    <p className="mt-1 truncate text-sm font-medium">
                      {banner.buttonText ||
                        "-"}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatDate(
                        banner.createdAt
                      )}
                    </p>

                  </div>

                </div>


                {/* ACTIONS */}

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/banners/${banner._id}`
                      )
                    }
                    className="flex items-center justify-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium"
                  >
                    <Eye size={15} />
                    View
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/banners/edit/${banner._id}`
                      )
                    }
                    className="flex items-center justify-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>


                  <button
                    type="button"
                    disabled={
                      deleting
                    }
                    onClick={() =>
                      handleDelete(
                        banner._id
                      )
                    }
                    className="flex items-center justify-center gap-1 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    Delete
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

export default Banners;