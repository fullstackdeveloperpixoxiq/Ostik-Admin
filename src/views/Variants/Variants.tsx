import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";

interface Product {
  _id: string;
  name: string;
  slug: string;
}

interface Variant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  discountPercent: number;
  stock: number;
  images: string[];
  isActive: boolean;
  product?: Product;
  createdAt: string;
}

const Variants = () => {
  const navigate = useNavigate();

  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const adminToken = localStorage.getItem("adminToken");

  const fetchVariants = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/variant/admin`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setVariants(response.data?.variants || []);
    } catch (error: any) {
      console.error("Fetch variants error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch variants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this variant?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/api/variant/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success("Variant deleted successfully");

      setVariants((prev) =>
        prev.filter((variant) => variant._id !== id)
      );
    } catch (error: any) {
      console.error("Delete variant error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete variant"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading variants...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Variants
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage product variants, pricing, stock and
            variant-specific images.
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/variants/add")
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Variant
        </button>
      </div>


      {/* DESKTOP TABLE */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">

        <Table>

          <TableHeader>
            <TableRow>

              <TableHead>Variant</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>

            {variants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-sm text-gray-500"
                >
                  No variants found.
                </TableCell>
              </TableRow>
            ) : (
              variants.map((variant) => (
                <TableRow key={variant._id}>

                  {/* VARIANT */}
                  <TableCell>

                    <div className="flex items-center gap-3">

                      {variant.images?.[0] ? (
                        <img
                          src={variant.images[0]}
                          alt={variant.name}
                          className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100" />
                      )}

                      <div className="min-w-0">

                        <p className="truncate font-medium text-gray-900">
                          {variant.name}
                        </p>

                      </div>

                    </div>

                  </TableCell>


                  {/* PRODUCT */}
                  <TableCell>
                    <span className="text-sm text-gray-700">
                      {variant.product?.name || "-"}
                    </span>
                  </TableCell>


                  {/* SKU */}
                  <TableCell>
                    <span className="font-mono text-xs text-gray-600">
                      {variant.sku}
                    </span>
                  </TableCell>


                  {/* PRICE */}
                  <TableCell>
                    <span className="font-medium text-gray-900">
                      ₹{Number(variant.price).toLocaleString("en-IN")}
                    </span>
                  </TableCell>


                  {/* DISCOUNT */}
                  <TableCell>
                    <span className="text-gray-700">
                      {variant.discountPercent || 0}%
                    </span>
                  </TableCell>


                  {/* STOCK */}
                  <TableCell>

                    <span
                      className={
                        variant.stock === 0
                          ? "font-medium text-red-600"
                          : variant.stock <= 5
                          ? "font-medium text-orange-600"
                          : "text-gray-700"
                      }
                    >
                      {variant.stock}
                    </span>

                  </TableCell>


                  {/* STATUS */}
                  <TableCell>

                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        variant.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {variant.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </TableCell>


                  {/* ACTIONS */}
                  <TableCell>

                    <div className="flex justify-end gap-1">

                      <button
                        onClick={() =>
                          navigate(
                            `/variants/${variant._id}`
                          )
                        }
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        title="View"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/variants/edit/${variant._id}`
                          )
                        }
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        title="Edit"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(variant._id)
                        }
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </TableCell>

                </TableRow>
              ))
            )}

          </TableBody>

        </Table>

      </div>


      {/* MOBILE CARDS */}
      <div className="space-y-4 md:hidden">

        {variants.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            No variants found.
          </div>
        ) : (
          variants.map((variant) => (
            <div
              key={variant._id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >

              <div className="flex gap-3">

                {variant.images?.[0] ? (
                  <img
                    src={variant.images[0]}
                    alt={variant.name}
                    className="h-16 w-16 flex-shrink-0 rounded-lg border object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100" />
                )}

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-2">

                    <h3 className="truncate font-semibold text-gray-900">
                      {variant.name}
                    </h3>

                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
                        variant.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {variant.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {variant.product?.name || "-"}
                  </p>

                  <p className="mt-1 font-mono text-xs text-gray-400">
                    {variant.sku}
                  </p>

                </div>

              </div>


              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">

                <div>
                  <p className="text-[11px] text-gray-400">
                    Price
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    ₹{Number(variant.price).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-gray-400">
                    Discount
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {variant.discountPercent || 0}%
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-gray-400">
                    Stock
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${
                      variant.stock === 0
                        ? "text-red-600"
                        : variant.stock <= 5
                        ? "text-orange-600"
                        : "text-gray-900"
                    }`}
                  >
                    {variant.stock}
                  </p>
                </div>

              </div>


              <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">

                <button
                  onClick={() =>
                    navigate(
                      `/variants/${variant._id}`
                    )
                  }
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <Eye size={17} />
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/variants/edit/${variant._id}`
                    )
                  }
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <Pencil size={17} />
                </button>

                <button
                  onClick={() =>
                    handleDelete(variant._id)
                  }
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={17} />
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default Variants;