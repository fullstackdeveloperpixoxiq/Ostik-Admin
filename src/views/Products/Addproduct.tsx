import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    specs: "{}",
    isFeatured: false,
    isNewArrival: false,
    status: "pending",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/category`
        );

        setCategories(response.data?.categories || []);
      } catch (error: unknown) {
        console.error("Category fetch error:", error);

        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch categories";

        toast.error(message || "Failed to fetch categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =========================================================
  // CLEANUP PREVIEWS
  // =========================================================

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews]);

  // =========================================================
  // INPUT CHANGE
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
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    if (files.length > 10) {
      toast.error("You can upload a maximum of 10 images");
      return;
    }

    // Only allow image files
    const invalidFile = files.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      toast.error("Only image files are allowed");
      return;
    }

    setImages(files);

    // ---------------------------------------------
    // CREATE LOCAL PREVIEWS
    // ---------------------------------------------

    const readers = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Could not create image preview"));
          }
        };

        reader.onerror = () => {
          reject(new Error("Could not read image"));
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then((results) => {
        setPreviews(results);
      })
      .catch((error) => {
        console.error("Preview error:", error);
        toast.error("Failed to preview selected images");
      });
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Product slug is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (images.length === 0) {
      toast.error("At least one product image is required");
      return;
    }

    // ---------------------------------------------
    // JSON VALIDATION
    // ---------------------------------------------

    try {
      JSON.parse(formData.specs);
    } catch {
      toast.error("Specs must contain valid JSON");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin authentication required");
        return;
      }

      // ---------------------------------------------
      // FORM DATA
      // ---------------------------------------------

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

      // ---------------------------------------------
      // ADD IMAGES
      // ---------------------------------------------

      images.forEach((image) => {
        data.append("images", image);
      });

      // ---------------------------------------------
      // DEBUG
      // ---------------------------------------------

      console.log("Uploading images:");

      images.forEach((image) => {
        console.log({
          name: image.name,
          type: image.type,
          size: image.size,
        });
      });

      // ---------------------------------------------
      // API REQUEST
      // ---------------------------------------------

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/product/admin`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Created product:",
        response.data?.product
      );

      toast.success(
        response.data?.message ||
          "Product created successfully"
      );

      navigate("/products");
    } catch (error: unknown) {
      console.error(
        "Create product error:",
        error
      );

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to create product";

      toast.error(
        message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Add Product
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Create a new product for your store
        </p>
      </div>

      <CardBox>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* BASIC DETAILS */}

          <div>
            <h5 className="text-lg font-semibold mb-4">
              Basic Information
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NAME */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              {/* SLUG */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug
                </label>

                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="product-slug"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={categoriesLoading}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select category"}
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

              {/* STATUS */}

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
                  <option value="pending">
                    Pending
                  </option>

                  <option value="approved">
                    Approved
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter product description"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          {/* =================================================
              IMAGES
          ================================================= */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Product Images
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              multiple
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-3"
            />

            <p className="text-xs text-gray-500 mt-2">
              Upload up to 10 images.
            </p>

            {/* PREVIEW */}

            {previews.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium mb-3">
                  Image Preview
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {previews.map(
                    (preview, index) => (
                      <div
                        key={`${preview}-${index}`}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${
                            index + 1
                          }`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )
                  )}
                </div>
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
              rows={6}
              placeholder='{"color":"Black","connectivity":"Bluetooth"}'
              className="w-full rounded-lg border border-gray-200 px-4 py-3 font-mono text-sm outline-none focus:border-primary"
            />

            <p className="text-xs text-gray-500 mt-2">
              Enter valid JSON.
            </p>
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

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-5 py-3 text-white font-medium disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Product"}
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

export default AddProduct;