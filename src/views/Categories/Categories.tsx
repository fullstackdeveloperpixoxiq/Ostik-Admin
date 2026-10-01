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

interface ParentCategory {
  _id: string;
  name: string;
  slug?: string;
}

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  parentCategory?: ParentCategory | null;
  isActive: boolean;
}

// =========================================================
// COMPONENT
// =========================================================

const Category = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/category`
      );

      console.log("Categories response:", response.data);

      setCategories(response.data?.categories || []);
    } catch (error: unknown) {
      console.error(
        "Fetch categories error:",
        error
      );

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to fetch categories";

      toast.error(
        message || "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  const deleteCategory = async (
    categoryId: string
  ) => {
    try {
      setDeletingId(categoryId);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error(
          "Admin authentication required"
        );
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/category/admin/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data?.message ||
          "Category deleted successfully"
      );

      setCategories((previousCategories) =>
        previousCategories.filter(
          (category) =>
            category._id !== categoryId
        )
      );
    } catch (error: unknown) {
      console.error(
        "Delete category error:",
        error
      );

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to delete category";

      toast.error(
        message || "Failed to delete category"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // SONNER DELETE CONFIRMATION
  // =========================================================

  const handleDeleteClick = (
    categoryId: string
  ) => {
    toast(
      "Are you sure you want to delete this category?",
      {
        action: {
          label: "Delete",
          onClick: () =>
            deleteCategory(categoryId),
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
  // STATUS STYLE
  // =========================================================

  const getStatusClass = (
    isActive: boolean
  ): string => {
    return isActive
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

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
          Categories
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage product categories in your store
        </p>
      </div>

      {/* =====================================================
          CATEGORY CARD
      ====================================================== */}

      <CardBox>
        {/* HEADER */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h5 className="text-lg font-semibold">
              Category List
            </h5>

            <p className="text-sm text-gray-500">
              View and manage all categories
            </p>
          </div>

          {/* ADD CATEGORY */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/categories/add"
              )
            }
            className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            Add Category
          </button>
        </div>

        {/* =================================================
            TABLE
        ================================================== */}

        <Table>
          {/* TABLE HEADER */}

          <TableHeader>
            <TableRow>
              <TableHead>
                Category
              </TableHead>

              <TableHead>
                Parent Category
              </TableHead>

              <TableHead>
                Slug
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
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              /* EMPTY */

              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              /* CATEGORIES */

              categories.map((category) => (
                <TableRow
                  key={category._id}
                >
                  {/* CATEGORY */}

                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* IMAGE */}

                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      {/* NAME */}

                      <div className="min-w-0">
                        <p className="font-medium text-gray-800">
                          {category.name}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {category.parentCategory
                            ? "Subcategory"
                            : "Main Category"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* PARENT CATEGORY */}

                  <TableCell>
                    {category.parentCategory?.name ||
                      "Main Category"}
                  </TableCell>

                  {/* SLUG */}

                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {category.slug}
                    </span>
                  </TableCell>

                  {/* STATUS */}

                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        category.isActive
                      )}`}
                    >
                      {category.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </TableCell>

                  {/* ACTIONS */}

                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/categories/${category._id}`
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
                            `/categories/edit/${category._id}`
                          )
                        }
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          category._id
                        }
                        onClick={() =>
                          handleDeleteClick(
                            category._id
                          )
                        }
                        className="text-red-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId ===
                        category._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardBox>
    </div>
  );
};

export default Category;