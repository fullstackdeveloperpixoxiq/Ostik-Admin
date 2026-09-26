import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  parentCategory?: {
    _id: string;
    name: string;
  } | null;
  isActive: boolean;
}

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [pageLoading, setPageLoading] =
    useState<boolean>(true);

  const [categoriesLoading, setCategoriesLoading] =
    useState<boolean>(true);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentCategory: "",
    isActive: true,
  });

  const [existingImage, setExistingImage] =
    useState<string>("");

  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string>("");

  // =========================================================
  // FETCH CATEGORY + MAIN CATEGORIES
  // =========================================================

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        return;
      }

      try {
        setPageLoading(true);

        const [categoryResponse, categoriesResponse] =
          await Promise.all([
            axios.get(
              `${import.meta.env.VITE_API_URL}/api/category/${id}`
            ),

            axios.get(
              `${import.meta.env.VITE_API_URL}/api/category/main`
            ),
          ]);

        const category =
          categoryResponse.data?.category;

        const mainCategories =
          categoriesResponse.data?.categories || [];

        if (!category) {
          toast.error("Category not found");

          navigate(
            "/ostik-admin/categories"
          );

          return;
        }

        setCategories(mainCategories);

        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          parentCategory:
            category.parentCategory?._id || "",
          isActive:
            category.isActive ?? true,
        });

        setExistingImage(
          category.image || ""
        );
      } catch (error: unknown) {
        console.error(
          "Fetch category data error:",
          error
        );

        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch category";

        toast.error(
          message || "Failed to fetch category"
        );
      } finally {
        setPageLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } =
      e.target;

    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement)
            .checked
        : undefined;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
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

    if (
      !selectedFile.type.startsWith(
        "image/"
      )
    ) {
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

    if (!id) {
      return;
    }

    if (!formData.name.trim()) {
      toast.error(
        "Category name is required"
      );

      return;
    }

    if (!formData.slug.trim()) {
      toast.error(
        "Category slug is required"
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

      data.append(
        "parentCategory",
        formData.parentCategory
      );

      data.append(
        "isActive",
        String(formData.isActive)
      );

      // Add only if new image selected
      if (image) {
        data.append("image", image);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/category/admin/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Updated category:",
        response.data?.category
      );

      toast.success(
        response.data?.message ||
          "Category updated successfully"
      );

      navigate(
        `/ostik-admin/categories/${id}`
      );
    } catch (error: unknown) {
      console.error(
        "Update category error:",
        error
      );

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to update category";

      toast.error(
        message || "Failed to update category"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // PAGE LOADING
  // =========================================================

  if (pageLoading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            Edit Category
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Loading category information...
          </p>
        </div>

        <CardBox>
          <div className="py-12 text-center text-gray-500">
            Loading category...
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
      {/* PAGE HEADER */}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Edit Category
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Update category information
        </p>
      </div>

      <CardBox>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* CATEGORY INFORMATION */}

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

                  {categories
                    .filter(
                      (category) =>
                        category._id !== id
                    )
                    .map((category) => (
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

                <label className="flex items-center gap-3 h-[50px]">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={
                      formData.isActive
                    }
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <span className="text-sm">
                    Active Category
                  </span>
                </label>
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

            <p className="text-xs text-gray-500 mt-2">
              Select a new image only if you want
              to replace the current image.
            </p>

            {/* IMAGE */}

            {(preview || existingImage) && (
              <div className="mt-5">
                <p className="text-sm font-medium mb-3">
                  {preview
                    ? "New Image Preview"
                    : "Current Image"}
                </p>

                <div className="h-48 w-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={
                      preview ||
                      existingImage
                    }
                    alt={formData.name}
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
                ? "Updating..."
                : "Update Category"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/ostik-admin/categories/${id}`
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

export default EditCategory;