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

interface Variant {
  _id: string;
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
}

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  images?: string[];
  category?: Category;
  variants?: Variant[];
  status?: "active" | "inactive" | "pending" | "approved" | "rejected";
}

// =========================================================
// COMPONENT
// =========================================================

const Product = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/product`
      );

      console.log("Products response:", response.data);

      setProducts(response.data?.products || []);

      // Check images coming from backend
      console.log(
        "Product images:",
        response.data?.products?.map((product: ProductItem) => ({
          name: product.name,
          images: product.images,
        }))
      );
    } catch (error) {
      console.error("Fetch products error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to fetch products";

      toast.error(message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const deleteProduct = async (productId: string) => {
    try {
      setDeletingId(productId);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin authentication required");
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/product/admin/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data?.message || "Product deleted successfully"
      );

      // Remove deleted product from UI
      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== productId
        )
      );
    } catch (error) {
      console.error("Delete product error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to delete product";

      toast.error(message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // SONNER DELETE CONFIRMATION
  // =========================================================

  const handleDeleteClick = (productId: string) => {
    toast("Are you sure you want to delete this product?", {
      action: {
        label: "Delete",
        onClick: () => deleteProduct(productId),
      },

      cancel: {
        label: "Cancel",
        onClick: () => {},
      },

      duration: 8000,
    });
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusClass = (
    status?: ProductItem["status"]
  ): string => {
    switch (status) {
      case "approved":
      case "active":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "inactive":
        return "bg-gray-100 text-gray-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // GET PRODUCT PRICE
  // =========================================================

  const getProductPrice = (
    variants?: Variant[]
  ): string => {
    if (!variants || variants.length === 0) {
      return "-";
    }

    const prices = variants
      .map((variant) => Number(variant.price))
      .filter((price) => !Number.isNaN(price));

    if (prices.length === 0) {
      return "-";
    }

    const lowestPrice = Math.min(...prices);

    return `₹${lowestPrice.toLocaleString("en-IN")}`;
  };

  // =========================================================
  // GET TOTAL STOCK
  // =========================================================

  const getTotalStock = (
    variants?: Variant[]
  ): number => {
    if (!variants || variants.length === 0) {
      return 0;
    }

    return variants.reduce((total, variant) => {
      return total + Number(variant.stock || 0);
    }, 0);
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
          Products
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage all products in your store
        </p>
      </div>

      {/* =====================================================
          PRODUCT CARD
      ====================================================== */}

      <CardBox>
        {/* HEADER */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h5 className="text-lg font-semibold">
              Product List
            </h5>

            <p className="text-sm text-gray-500">
              View and manage your products
            </p>
          </div>

          {/* ADD PRODUCT */}

          <button
            type="button"
            onClick={() =>
              navigate("/products/add")
            }
            className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            Add Product
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
                Product
              </TableHead>

              <TableHead>
                Category
              </TableHead>

              <TableHead>
                Price
              </TableHead>

              <TableHead>
                Stock
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
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              /* EMPTY */

              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              /* PRODUCTS */

              products.map((product) => {
                const totalStock = getTotalStock(
                  product.variants
                );

                const productImage =
                  product.images?.[0];

                return (
                  <TableRow key={product._id}>
                    {/* PRODUCT */}

                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* IMAGE */}

                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        {/* NAME */}

                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[220px]">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* CATEGORY */}

                    <TableCell>
                      {product.category?.name || "-"}
                    </TableCell>

                    {/* PRICE */}

                    <TableCell className="font-medium">
                      {getProductPrice(
                        product.variants
                      )}
                    </TableCell>

                    {/* STOCK */}

                    <TableCell>
                      {totalStock}
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(
                          product.status
                        )}`}
                      >
                        {product.status || "-"}
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
                              `/products/${product._id}`
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
                              `/products/edit/${product._id}`
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
                            deletingId === product._id
                          }
                          onClick={() =>
                            handleDeleteClick(product._id)
                          }
                          className="text-red-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === product._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardBox>
    </div>
  );
};

export default Product;