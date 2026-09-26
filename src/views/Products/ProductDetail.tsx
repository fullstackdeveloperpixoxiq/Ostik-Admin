import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Variant {
  _id: string;
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  discountPercent?: number;
  isActive?: boolean;
  images?: string[];
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  specs?: Record<string, unknown>;
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
  variants?: Variant[];
  status?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  ratingAverage?: number;
  ratingCount?: number;
  createdAt?: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        toast.error("Product ID is missing");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/product/${id}`
        );

        setProduct(response.data?.product || null);
      } catch (error: unknown) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch product";

        toast.error(message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <CardBox>
        <div className="py-10 text-center text-gray-500">
          Loading product...
        </div>
      </CardBox>
    );
  }

  if (!product) {
    return (
      <CardBox>
        <div className="py-10 text-center">
          <p className="text-gray-500 mb-4">
            Product not found
          </p>

          <button
            onClick={() =>
              navigate("/ostik-admin/products")
            }
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Back to Products
          </button>
        </div>
      </CardBox>
    );
  }

  return (
    <div>
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">
            Product Details
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View complete product information
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(
                `/ostik-admin/products/edit/${product._id}`
              )
            }
            className="rounded-md bg-primary px-4 py-2 text-white font-medium"
          >
            Edit Product
          </button>

          <button
            onClick={() =>
              navigate("/ostik-admin/products")
            }
            className="rounded-md border border-gray-300 px-4 py-2 font-medium"
          >
            Back
          </button>
        </div>
      </div>

      {/* BASIC DETAILS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* IMAGES */}

        <CardBox>
          <h5 className="text-lg font-semibold mb-4">
            Images
          </h5>

          <div className="grid grid-cols-2 gap-3">
            {product.images?.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden border"
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </CardBox>

        {/* INFORMATION */}

        <CardBox className="lg:col-span-2">
          <h5 className="text-lg font-semibold mb-5">
            Information
          </h5>

          <div className="space-y-4">

            <div>
              <p className="text-xs text-gray-500">
                Product Name
              </p>

              <p className="font-medium mt-1">
                {product.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Slug
              </p>

              <p className="font-medium mt-1">
                {product.slug}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Category
              </p>

              <p className="font-medium mt-1">
                {product.category?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Status
              </p>

              <p className="font-medium mt-1 capitalize">
                {product.status || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Description
              </p>

              <p className="text-sm mt-1 text-gray-700 whitespace-pre-wrap">
                {product.description || "-"}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <span>
                Featured:{" "}
                <strong>
                  {product.isFeatured ? "Yes" : "No"}
                </strong>
              </span>

              <span>
                New Arrival:{" "}
                <strong>
                  {product.isNewArrival ? "Yes" : "No"}
                </strong>
              </span>
            </div>

          </div>
        </CardBox>

      </div>

      {/* VARIANTS */}

      <div className="mt-6">
        <CardBox>
          <h5 className="text-lg font-semibold mb-5">
            Variants
          </h5>

          {!product.variants ||
          product.variants.length === 0 ? (
            <p className="text-sm text-gray-500">
              No variants found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 pr-4">
                      Name
                    </th>

                    <th className="text-left py-3 pr-4">
                      SKU
                    </th>

                    <th className="text-left py-3 pr-4">
                      Price
                    </th>

                    <th className="text-left py-3 pr-4">
                      Discount
                    </th>

                    <th className="text-left py-3 pr-4">
                      Stock
                    </th>

                    <th className="text-left py-3">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {product.variants.map((variant) => (
                    <tr
                      key={variant._id}
                      className="border-b last:border-0"
                    >
                      <td className="py-4 pr-4">
                        {variant.name || "-"}
                      </td>

                      <td className="py-4 pr-4">
                        {variant.sku || "-"}
                      </td>

                      <td className="py-4 pr-4 font-medium">
                        ₹
                        {Number(
                          variant.price || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td className="py-4 pr-4">
                        {variant.discountPercent || 0}%
                      </td>

                      <td className="py-4 pr-4">
                        {variant.stock ?? 0}
                      </td>

                      <td className="py-4">
                        {variant.isActive
                          ? "Active"
                          : "Inactive"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBox>
      </div>

      {/* SPECS */}

      <div className="mt-6">
        <CardBox>
          <h5 className="text-lg font-semibold mb-5">
            Specifications
          </h5>

          {product.specs &&
          Object.keys(product.specs).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(product.specs).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:gap-4"
                  >
                    <span className="font-medium capitalize">
                      {key}:
                    </span>

                    <span className="text-gray-600">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No specifications available.
            </p>
          )}
        </CardBox>
      </div>
    </div>
  );
};

export default ProductDetails;