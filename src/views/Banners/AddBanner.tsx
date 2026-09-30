import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Category {
  _id: string;
  name: string;
}

const AddBanner = () => {
  const navigate = useNavigate();

  const [title, setTitle] =
    useState("");

  const [subtitle, setSubtitle] =
    useState("");

  const [buttonText, setButtonText] =
    useState("Shop Now");

  const [buttonLink, setButtonLink] =
    useState("/products");

  const [category, setCategory] =
    useState("");

  const [displayOrder, setDisplayOrder] =
    useState("0");

  const [status, setStatus] =
    useState<"active" | "inactive">(
      "active"
    );

  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string>("");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = async () => {
    try {
      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/category`
        );

      setCategories(
        response.data?.categories || []
      );
    } catch (error) {
      console.error(
        "Fetch categories error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================================================
  // IMAGE
  // =========================================================

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setImage(file);

    const reader =
      new FileReader();

    reader.onloadend = () => {
      setPreview(
        reader.result as string
      );
    };

    reader.readAsDataURL(file);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error(
        "Banner title is required"
      );
      return;
    }

    if (!image) {
      toast.error(
        "Banner image is required"
      );
      return;
    }

    try {
      setLoading(true);

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

      const formData =
        new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "subtitle",
        subtitle.trim()
      );

      formData.append(
        "buttonText",
        buttonText.trim()
      );

      formData.append(
        "buttonLink",
        buttonLink.trim()
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "displayOrder",
        displayOrder
      );

      formData.append(
        "status",
        status
      );

      formData.append(
        "image",
        image
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/banner/admin`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Banner created successfully"
      );

      navigate(
        "/banners"
      );

    } catch (error: unknown) {
      console.error(
        "Create banner error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to create banner";

      toast.error(
        message ||
          "Failed to create banner"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/banners"
            )
          }
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          Back to Banners
        </button>

        <h2 className="text-2xl font-semibold">
          Add Banner
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create a new homepage banner
        </p>

      </div>


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* BASIC INFORMATION */}

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Banner Information
          </h5>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* TITLE */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter banner title"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />

            </div>


            {/* SUBTITLE */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Subtitle
              </label>

              <textarea
                value={subtitle}
                onChange={(e) =>
                  setSubtitle(
                    e.target.value
                  )
                }
                placeholder="Enter banner subtitle"
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />

            </div>


            {/* BUTTON TEXT */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Button Text
              </label>

              <input
                type="text"
                value={buttonText}
                onChange={(e) =>
                  setButtonText(
                    e.target.value
                  )
                }
                placeholder="Shop Now"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />

            </div>


            {/* BUTTON LINK */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Button Link
              </label>

              <input
                type="text"
                value={buttonLink}
                onChange={(e) =>
                  setButtonLink(
                    e.target.value
                  )
                }
                placeholder="/products"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />

            </div>


            {/* CATEGORY */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              >

                <option value="">
                  No Category
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* DISPLAY ORDER */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Display Order
              </label>

              <input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) =>
                  setDisplayOrder(
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />

            </div>


            {/* STATUS */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as
                      | "active"
                      | "inactive"
                  )
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              >

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>

        </CardBox>


        {/* IMAGE */}

        <CardBox>

          <h5 className="mb-5 text-lg font-semibold">
            Banner Image
          </h5>

          <div>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />

          </div>


          {preview && (

            <div className="mt-5">

              <p className="mb-2 text-sm text-gray-500">
                Preview
              </p>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">

                <img
                  src={preview}
                  alt="Banner preview"
                  className="max-h-[350px] w-full object-cover"
                />

              </div>

            </div>

          )}

        </CardBox>


        {/* BUTTONS */}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/banners"
              )
            }
            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Banner"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddBanner;