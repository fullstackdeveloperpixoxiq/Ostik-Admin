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

interface User {
  _id: string;
  name?: string;
  email?: string;
}

interface Product {
  _id: string;
  name?: string;
  images?: string[];
}

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt?: string;

  user?: User;
  product?: Product;
}

// =========================================================
// COMPONENT
// =========================================================

const Reviews = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [approvalLoadingId, setApprovalLoadingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // =========================================================
  // FETCH REVIEWS
  // =========================================================

  const fetchReviews = async () => {
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
        `${import.meta.env.VITE_API_URL}/api/review/admin/all`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Reviews response:",
        response.data
      );

      setReviews(
        response.data?.reviews || []
      );
    } catch (error: unknown) {
      console.error(
        "Fetch reviews error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch reviews";

      toast.error(
        message ||
          "Failed to fetch reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // =========================================================
  // UPDATE APPROVAL
  // =========================================================

  const updateApproval = async (
    reviewId: string,
    isApproved: boolean
  ) => {
    try {
      setApprovalLoadingId(reviewId);

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

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/review/admin/${reviewId}`,
        {
          isApproved,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data?.message ||
          "Review approval updated"
      );

      setReviews(
        (previousReviews) =>
          previousReviews.map(
            (review) =>
              review._id === reviewId
                ? {
                    ...review,
                    isApproved,
                  }
                : review
          )
      );
    } catch (error: unknown) {
      console.error(
        "Update review approval error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to update review approval";

      toast.error(
        message ||
          "Failed to update review approval"
      );
    } finally {
      setApprovalLoadingId(null);
    }
  };

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const deleteReview = async (
    reviewId: string
  ) => {
    try {
      setDeletingId(reviewId);

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
          `${import.meta.env.VITE_API_URL}/api/review/admin/${reviewId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      toast.success(
        response.data?.message ||
          "Review deleted successfully"
      );

      setReviews(
        (previousReviews) =>
          previousReviews.filter(
            (review) =>
              review._id !== reviewId
          )
      );
    } catch (error: unknown) {
      console.error(
        "Delete review error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to delete review";

      toast.error(
        message ||
          "Failed to delete review"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // DELETE CONFIRMATION
  // =========================================================

  const handleDeleteClick = (
    reviewId: string
  ) => {
    toast(
      "Are you sure you want to delete this review?",
      {
        action: {
          label: "Delete",
          onClick: () =>
            deleteReview(reviewId),
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
  // FORMAT DATE
  // =========================================================

  const formatDate = (
    date?: string
  ): string => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // RATING
  // =========================================================

  const renderRating = (
    rating: number
  ) => {
    return (
      <div className="flex items-center gap-1">
        <span className="font-medium text-gray-800">
          {rating}
        </span>

        <span className="text-yellow-500">
          ★
        </span>
      </div>
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            Reviews
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage product reviews from customers
          </p>
        </div>

        <CardBox>
          <div className="py-12 text-center text-gray-500">
            Loading reviews...
          </div>
        </CardBox>
      </div>
    );
  }

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
          Reviews
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage product reviews from customers
        </p>
      </div>

      {/* =====================================================
          REVIEW CARD
      ====================================================== */}

      <CardBox>
        {/* CARD HEADER */}

        <div className="mb-5">
          <h5 className="text-lg font-semibold">
            Review List
          </h5>

          <p className="text-sm text-gray-500 mt-1">
            View and manage customer reviews
          </p>
        </div>

        {/* =================================================
            DESKTOP TABLE
        ================================================== */}

        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Customer
                </TableHead>

                <TableHead>
                  Product
                </TableHead>

                <TableHead>
                  Rating
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Date
                </TableHead>

                <TableHead>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow
                    key={review._id}
                  >
                    {/* CUSTOMER */}

                    <TableCell>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-[180px]">
                          {review.user?.name ||
                            "Unknown customer"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1 truncate max-w-[180px]">
                          {review.user?.email ||
                            "-"}
                        </p>
                      </div>
                    </TableCell>

                    {/* PRODUCT */}

                    <TableCell>
                      <p className="max-w-[180px] truncate">
                        {review.product?.name ||
                          "Unknown product"}
                      </p>
                    </TableCell>

                    {/* RATING */}

                    <TableCell>
                      {renderRating(
                        review.rating
                      )}
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          review.isApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {review.isApproved
                          ? "Approved"
                          : "Not Approved"}
                      </span>
                    </TableCell>

                    {/* DATE */}

                    <TableCell>
                      {formatDate(
                        review.createdAt
                      )}
                    </TableCell>

                    {/* ACTIONS */}

                    <TableCell>
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/reviews/${review._id}`
                            )
                          }
                          className="text-primary hover:underline font-medium"
                        >
                          View
                        </button>

                        {/* APPROVE / UNAPPROVE */}

                        <button
                          type="button"
                          disabled={
                            approvalLoadingId ===
                            review._id
                          }
                          onClick={() =>
                            updateApproval(
                              review._id,
                              !review.isApproved
                            )
                          }
                          className="text-blue-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {approvalLoadingId ===
                          review._id
                            ? "Updating..."
                            : review.isApproved
                            ? "Unapprove"
                            : "Approve"}
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            review._id
                          }
                          onClick={() =>
                            handleDeleteClick(
                              review._id
                            )
                          }
                          className="text-red-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId ===
                          review._id
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
        </div>

        {/* =================================================
            MOBILE CARDS
        ================================================== */}

        <div className="md:hidden">
          {reviews.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No reviews found
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  {/* CUSTOMER */}

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Customer
                    </p>

                    <p className="font-semibold text-gray-800">
                      {review.user?.name ||
                        "Unknown customer"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 break-all">
                      {review.user?.email ||
                        "-"}
                    </p>
                  </div>

                  {/* PRODUCT */}

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Product
                    </p>

                    <p className="font-medium text-gray-800">
                      {review.product?.name ||
                        "Unknown product"}
                    </p>
                  </div>

                  {/* RATING + STATUS */}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Rating
                      </p>

                      {renderRating(
                        review.rating
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Status
                      </p>

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          review.isApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {review.isApproved
                          ? "Approved"
                          : "Not Approved"}
                      </span>
                    </div>
                  </div>

                  {/* DATE */}

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Date
                    </p>

                    <p className="text-sm text-gray-700">
                      {formatDate(
                        review.createdAt
                      )}
                    </p>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                    {/* VIEW */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/reviews/${review._id}`
                        )
                      }
                      className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-white"
                    >
                      View
                    </button>

                    {/* APPROVE / UNAPPROVE */}

                    <button
                      type="button"
                      disabled={
                        approvalLoadingId ===
                        review._id
                      }
                      onClick={() =>
                        updateApproval(
                          review._id,
                          !review.isApproved
                        )
                      }
                      className="rounded-md border border-blue-200 px-3 py-2 text-xs font-medium text-blue-600 disabled:opacity-50"
                    >
                      {approvalLoadingId ===
                      review._id
                        ? "Updating..."
                        : review.isApproved
                        ? "Unapprove"
                        : "Approve"}
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        review._id
                      }
                      onClick={() =>
                        handleDeleteClick(
                          review._id
                        )
                      }
                      className="rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 disabled:opacity-50"
                    >
                      {deletingId ===
                      review._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardBox>
    </div>
  );
};

export default Reviews;