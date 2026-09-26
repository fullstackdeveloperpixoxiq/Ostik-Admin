import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: {
    _id: string;
    name: string;
  } | null;
}

const AddCategory = () => {
  const navigate = useNavigate();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentCategory: "",
  });

  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string>("");

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/category/main`
        );

        setCategories(
          response.data?.categories || []
        );
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
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =========================================================
  // CLEANUP PREVIEW
  // =========================================================

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast.error(
        "Please select a valid image"
      );
      return;
    }

    setImage(selectedFile);

    const imagePreview =
      URL.createObjectURL(selectedFile);

    setPreview(imagePreview);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Category slug is required");
      return;
    }

    if (!image) {
      toast.error(
        "Category image is required"
      );
      return;
    }

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

      const data = new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "slug",
        formData.slug.trim().toLowerCase()
      );

      if (formData.parentCategory) {
        data.append(
          "parentCategory",
          formData.parentCategory
        );
      }

      data.append("image", image);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/category/admin`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data?.message ||
          "Category created successfully"
      );

      navigate("/ostik-admin/categories");
    } catch (error: unknown) {
      console.error(
        "Create category error:",
        error
      );

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to create category";

      toast.error(
        message || "Failed to create category"
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
          Add Category
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Create a new category for your store
        </p>
      </div>

      <CardBox>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* BASIC INFORMATION */}

          <div>
            <h5 className="text-lg font-semibold mb-4">
              Category Information
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NAME */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
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
                  placeholder="category-slug"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              {/* PARENT CATEGORY */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Parent Category
                </label>

                <select
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleChange}
                  disabled={categoriesLoading}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "None (Main Category)"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* IMAGE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Category Image
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-3"
            />

            {/* IMAGE PREVIEW */}

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-3">
                  Image Preview
                </p>

                <div className="h-40 w-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={preview}
                    alt="Category preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
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
                : "Create Category"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/ostik-admin/categories"
                )
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

export default AddCategory;