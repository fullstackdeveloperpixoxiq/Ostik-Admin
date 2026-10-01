import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Pencil,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router";
import { toast } from "sonner";

interface Variant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  discountPercent: number;
  stock: number;
  images: string[];
  isActive: boolean;
  product?: {
    _id: string;
    name: string;
    slug: string;
    images?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

const VariantDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [variant, setVariant] =
    useState<Variant | null>(null);

  const [loading, setLoading] =
    useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL;

  const adminToken =
    localStorage.getItem(
      "adminToken"
    );

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const response =
          await axios.get(
            `${API_URL}/api/variant/admin/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${adminToken}`,
              },
            }
          );

        setVariant(
          response.data?.variant || null
        );
      } catch (error: any) {
        console.error(
          "Fetch variant error:",
          error
        );

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to load variant"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVariant();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading variant...
        </p>
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="space-y-4">
        <button
          onClick={() =>
            navigate(
              "/variants"
            )
          }
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Variants
        </button>

        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-500">
            Variant not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              navigate(
                "/variants"
              )
            }
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Variant Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {variant.name}
            </p>
          </div>

        </div>

        <button
          onClick={() =>
            navigate(
              `/variants/edit/${variant._id}`
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Pencil size={17} />
          Edit Variant
        </button>

      </div>


      {/* BASIC INFORMATION */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">

        <h2 className="text-base font-semibold text-gray-900">
          Variant Information
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <p className="text-xs text-gray-500">
              Product
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {variant.product?.name ||
                "-"}
            </p>
          </div>


          <div>
            <p className="text-xs text-gray-500">
              Variant / Color
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {variant.name}
            </p>
          </div>


          <div>
            <p className="text-xs text-gray-500">
              SKU
            </p>

            <p className="mt-1 font-mono text-sm font-medium text-gray-900">
              {variant.sku}
            </p>
          </div>


          <div>
            <p className="text-xs text-gray-500">
              Price
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              ₹
              {Number(
                variant.price
              ).toLocaleString("en-IN")}
            </p>
          </div>


          <div>
            <p className="text-xs text-gray-500">
              Discount
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {variant.discountPercent ||
                0}
              %
            </p>
          </div>


          <div>
            <p className="text-xs text-gray-500">
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


          <div>
            <p className="text-xs text-gray-500">
              Status
            </p>

            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
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


          <div>
            <p className="text-xs text-gray-500">
              Created
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {new Date(
                variant.createdAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>
          </div>


          <div>
            <p className="text-xs text-gray-500">
              Last Updated
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {new Date(
                variant.updatedAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>
          </div>

        </div>

      </div>


      {/* VARIANT IMAGES */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">

        <h2 className="text-base font-semibold text-gray-900">
          Variant Images
        </h2>

        {variant.images?.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-4">

            {variant.images.map(
              (image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <img
                    src={image}
                    alt={`${variant.name} ${
                      index + 1
                    }`}
                    className="h-32 w-32 object-cover"
                  />
                </div>
              )
            )}

          </div>
        ) : (
          <p className="mt-5 text-sm text-gray-500">
            No variant-specific images uploaded.
          </p>
        )}

      </div>


      {/* PRODUCT IMAGES FALLBACK INFO */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

        <p className="text-sm text-gray-600">
          If this variant has no specific images,
          the customer product page can fall back to
          the main product images.
        </p>

      </div>

    </div>
  );
};

export default VariantDetails;