import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

interface ProductData {
  name: string;
  slug: string;
  description: string;
  category: string;
  specs: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  status: string;
}

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProductData>({
    name: "",
    slug: "",
    description: "",
    category: "",
    specs: "{}",
    isFeatured: false,
    isNewArrival: false,
    status: "pending",
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // =========================================================
  // FETCH PRODUCT + CATEGORIES
  // =========================================================

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("Product ID is missing");
        navigate("/products");
        return;
      }

      try {
        setLoading(true);

        const [productResponse, categoryResponse] =
          await Promise.all([
            axios.get(
              `${import.meta.env.VITE_API_URL}/api/product/${id}`
            ),
            axios.get(
              `${import.meta.env.VITE_API_URL}/api/category`
            ),
          ]);

        const product = productResponse.data?.product;

        if (!product) {
          toast.error("Product not found");
          navigate("/products");
          return;
        }

        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          category: product.category?._id || product.category || "",
          specs: JSON.stringify(product.specs || {}, null, 2),
          isFeatured: Boolean(product.isFeatured),
          isNewArrival: Boolean(product.isNewArrival),
          status: product.status || "pending",
        });

        setExistingImages(product.images || []);
        setCategories(categoryResponse.data?.categories || []);
      } catch (error: unknown) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to load product";

        toast.error(message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // =========================================================
  // INPUT
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : undefined;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // NEW IMAGES
  // =========================================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 10) {
      toast.error("You can upload a maximum of 10 images");
      return;
    }

    setNewImages(files);

    setPreviews(
      files.map((file) => URL.createObjectURL(file))
    );
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!id) {
      toast.error("Product ID is missing");
      return;
    }

    try {
      JSON.parse(formData.specs);
    } catch {
      toast.error("Specs must contain valid JSON");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin authentication required");
        return;
      }

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("slug", formData.slug.trim().toLowerCase());
      data.append(
        "description",
        formData.description.trim()
      );
      data.append("category", formData.category);
      data.append("specs", formData.specs);
      data.append(
        "isFeatured",
        String(formData.isFeatured)
      );
      data.append(
        "isNewArrival",
        String(formData.isNewArrival)
      );
      data.append("status", formData.status);

      newImages.forEach((image) => {
        data.append("images", image);
      });

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/product/admin/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        response.data?.message || "Product updated successfully"
      );

      navigate("/products");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to update product";

      toast.error(message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <CardBox>
        <div className="py-10 text-center text-gray-500">
          Loading product...
        </div>
      </CardBox>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Edit Product
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Update product information
        </p>
      </div>

      <CardBox>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <h5 className="text-lg font-semibold mb-4">
              Product Information
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug
                </label>

                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          {/* EXISTING IMAGES */}

          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Images
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {existingImages.map((image, index) => (
                  <div
                    key={index}
                    className="h-24 rounded-lg overflow-hidden border"
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEW IMAGES */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Replace Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-3"
            />

            <p className="text-xs text-gray-500 mt-2">
              According to the current backend, uploading new
              images replaces the existing image array.
            </p>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="h-24 rounded-lg overflow-hidden border"
                  >
                    <img
                      src={preview}
                      alt={`New preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SPECS */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Specifications
            </label>

            <textarea
              name="specs"
              value={formData.specs}
              onChange={handleChange}
              rows={8}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 font-mono text-sm outline-none focus:border-primary"
            />
          </div>

          {/* OPTIONS */}

          <div className="flex flex-col sm:flex-row gap-5">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />

              <span className="text-sm">
                Featured Product
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
              />

              <span className="text-sm">
                New Arrival
              </span>
            </label>

          </div>

          {/* ACTIONS */}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary px-5 py-3 text-white font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Product"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="rounded-md border border-gray-300 px-5 py-3 font-medium"
            >
              Cancel
            </button>
          </div>

        </form>
      </CardBox>
    </div>
  );
};

export default EditProduct;