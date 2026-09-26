import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface ParentCategory {
  _id: string;
  name: string;
  slug?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  parentCategory?: ParentCategory | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const CategoryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [category, setCategory] =
    useState<Category | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  // =========================================================
  // FETCH CATEGORY
  // =========================================================

  const fetchCategory = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/category/${id}`
      );

      console.log(
        "Category response:",
        response.data
      );

      setCategory(
        response.data?.category || null
      );
    } catch (error: unknown) {
      console.error(
        "Fetch category error:",
        error
      );

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to fetch category";

      toast.error(
        message || "Failed to fetch category"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            Category Details
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Loading category information...
          </p>
        </div>

        <CardBox>
          <div className="py-12 text-center text-gray-500">
            Loading category...
          </div>
        </CardBox>
      </div>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!category) {
    return (
      <div>
        <CardBox>
          <div className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              Category not found
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/ostik-admin/categories"
                )
              }
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Back to Categories
            </button>
          </div>
        </CardBox>
      </div>
    );
  }

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (
    date?: string
  ): string => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
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
              Category Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View category information
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/ostik-admin/categories/edit/${category._id}`
                )
              }
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
            >
              Edit Category
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/ostik-admin/categories"
                )
              }
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY CONTENT */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IMAGE */}

        <CardBox>
          <h5 className="text-lg font-semibold mb-4">
            Category Image
          </h5>

          <div className="aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
        </CardBox>

        {/* CATEGORY INFORMATION */}

        <CardBox className="lg:col-span-2">
          <h5 className="text-lg font-semibold mb-6">
            Category Information
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* NAME */}

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Category Name
              </p>

              <p className="font-medium text-gray-800">
                {category.name}
              </p>
            </div>

            {/* SLUG */}

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Slug
              </p>

              <p className="font-medium text-gray-800">
                {category.slug}
              </p>
            </div>

            {/* PARENT */}

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Parent Category
              </p>

              <p className="font-medium text-gray-800">
                {category.parentCategory?.name ||
                  "Main Category"}
              </p>
            </div>

            {/* STATUS */}

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Status
              </p>

              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  category.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {category.isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            {/* CREATED */}

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Created At
              </p>

              <p className="font-medium text-gray-800">
                {formatDate(category.createdAt)}
              </p>
            </div>

            {/* UPDATED */}

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Last Updated
              </p>

              <p className="font-medium text-gray-800">
                {formatDate(category.updatedAt)}
              </p>
            </div>
          </div>
        </CardBox>
      </div>
    </div>
  );
};

export default CategoryDetails;