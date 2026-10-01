import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface User {
  _id: string;
  name?: string;
  email?: string;
  profileImage?: string;
}

interface Product {
  _id: string;
  name?: string;
  images?: string[];
}

interface Order {
  _id: string;
  orderId?: string;
  total?: number;
  orderStatus?: string;
  paymentStatus?: string;
}

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  product?: Product;
  order?: Order;
}

const ReviewDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // =========================================================
  // FETCH REVIEW
  // =========================================================

  const fetchReview = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin authentication required");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/review/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reviews = response.data?.reviews || [];

      const foundReview = reviews.find(
        (item: Review) => item._id === id
      );

      if (!foundReview) {
        toast.error("Review not found");

        navigate("/reviews");

        return;
      }

      setReview(foundReview);
    } catch (error: unknown) {
      console.error("Fetch review error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to fetch review";

      toast.error(message || "Failed to fetch review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReview();
    }
  }, [id]);

  // =========================================================
  // UPDATE APPROVAL
  // =========================================================

  const handleApproval = async () => {
    if (!review) return;

    try {
      setApprovalLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin authentication required");
        return;
      }

      const newApproval = !review.isApproved;

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/review/admin/${review._id}`,
        {
          isApproved: newApproval,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data?.message || "Review approval updated"
      );

      setReview((prev) =>
        prev
          ? {
              ...prev,
              isApproved: newApproval,
            }
          : prev
      );
    } catch (error: unknown) {
      console.error("Approval update error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to update approval";

      toast.error(message || "Failed to update approval");
    } finally {
      setApprovalLoading(false);
    }
  };

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const deleteReview = async () => {
    if (!review) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin authentication required");
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/review/admin/${review._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data?.message ||
          "Review deleted successfully"
      );

      navigate("/reviews");
    } catch (error: unknown) {
      console.error("Delete review error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to delete review";

      toast.error(message || "Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // DELETE CONFIRMATION
  // =========================================================

  const handleDelete = () => {
    toast("Are you sure you want to delete this review?", {
      action: {
        label: "Delete",
        onClick: () => deleteReview(),
      },

      cancel: {
        label: "Cancel",
        onClick: () => {},
      },

      duration: 8000,
    });
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date?: string): string => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <CardBox>
        <div className="py-12 text-center text-gray-500">
          Loading review...
        </div>
      </CardBox>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!review) {
    return (
      <CardBox>
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500">
            Review not found
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/reviews")
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Back to Reviews
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
              Review Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage customer review
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={approvalLoading}
              onClick={handleApproval}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {approvalLoading
                ? "Updating..."
                : review.isApproved
                ? "Unapprove"
                : "Approve"}
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/reviews")
              }
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* CUSTOMER */}
        <CardBox>
          <h5 className="mb-5 text-lg font-semibold">
            Customer
          </h5>

          <div className="flex items-center gap-4">
            {/* CUSTOMER IMAGE */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              {review.user?.profileImage ? (
                <img
                  src={review.user.profileImage}
                  alt={review.user.name || "Customer"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-500">
                  {review.user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-gray-800">
                {review.user?.name ||
                  "Unknown customer"}
              </p>

              <p className="mt-1 break-all text-sm text-gray-500">
                {review.user?.email || "-"}
              </p>
            </div>
          </div>
        </CardBox>

        {/* PRODUCT */}
        <CardBox>
          <h5 className="mb-5 text-lg font-semibold">
            Product
          </h5>

          <div className="flex items-center gap-4">
            {/* PRODUCT IMAGE */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {review.product?.images?.[0] ? (
                <img
                  src={review.product.images[0]}
                  alt={
                    review.product.name ||
                    "Product"
                  }
                  className="h-full w-full object-contain p-1"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-gray-800">
                {review.product?.name ||
                  "Unknown product"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Product review
              </p>
            </div>
          </div>
        </CardBox>

        {/* REVIEW STATUS */}
        <CardBox>
          <h5 className="mb-5 text-lg font-semibold">
            Review Status
          </h5>

          <div className="space-y-4">

            {/* RATING */}
            <div>
              <p className="mb-1 text-sm text-gray-500">
                Rating
              </p>

              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {review.rating}
                </span>

                <span className="text-xl text-yellow-500">
                  ★
                </span>

                <span className="text-sm text-gray-500">
                  / 5
                </span>
              </div>
            </div>

            {/* PURCHASE */}
            <div>
              <p className="mb-1 text-sm text-gray-500">
                Purchase Verification
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  review.isVerifiedPurchase
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {review.isVerifiedPurchase
                  ? "Verified Purchase"
                  : "Not Verified"}
              </span>
            </div>

            {/* APPROVAL */}
            <div>
              <p className="mb-1 text-sm text-gray-500">
                Approval
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
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
        </CardBox>
      </div>

      {/* REVIEW CONTENT */}
      <div className="mt-6">
        <CardBox>
          <h5 className="mb-5 text-lg font-semibold">
            Review
          </h5>

          {/* COMMENT */}
          <div className="mb-6">
            <p className="mb-2 text-sm text-gray-500">
              Comment
            </p>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
              <p className="leading-7 text-gray-700">
                {review.comment ||
                  "No comment provided"}
              </p>
            </div>
          </div>

          {/* REVIEW IMAGES */}
          {review.images &&
            review.images.length > 0 && (
              <div>
                <p className="mb-3 text-sm text-gray-500">
                  Review Images
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {review.images.map(
                    (image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <img
                          src={image}
                          alt={`Review image ${
                            index + 1
                          }`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </CardBox>
      </div>

      {/* ORDER INFORMATION */}
      <div className="mt-6">
        <CardBox>
          <h5 className="mb-5 text-lg font-semibold">
            Order Information
          </h5>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="mb-1 text-sm text-gray-500">
                Order ID
              </p>

              <p className="break-all font-medium">
                {review.order?.orderId ||
                  review.order?._id ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm text-gray-500">
                Order Total
              </p>

              <p className="font-medium">
                {review.order?.total !==
                undefined
                  ? `₹${Number(
                      review.order.total
                    ).toLocaleString("en-IN")}`
                  : "-"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm text-gray-500">
                Order Status
              </p>

              <p className="font-medium capitalize">
                {review.order?.orderStatus ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm text-gray-500">
                Payment Status
              </p>

              <p className="font-medium capitalize">
                {review.order?.paymentStatus ||
                  "-"}
              </p>
            </div>
          </div>
        </CardBox>
      </div>

      {/* DATES */}
      <div className="mt-6">
        <CardBox>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            <div>
              <p className="mb-1 text-sm text-gray-500">
                Review Created
              </p>

              <p className="font-medium">
                {formatDate(review.createdAt)}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm text-gray-500">
                Last Updated
              </p>

              <p className="font-medium">
                {formatDate(review.updatedAt)}
              </p>
            </div>

          </div>
        </CardBox>
      </div>
    </div>
  );
};

export default ReviewDetails;