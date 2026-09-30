import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import CardBox from "../../components/shared/CardBox";

interface Category {
  _id: string;
  name: string;
}

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  category?: Category | null;
  displayOrder?: number;
  status: "active" | "inactive";
}

const EditBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [banner, setBanner] =
    useState<Banner | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [title, setTitle] =
    useState("");

  const [subtitle, setSubtitle] =
    useState("");

  const [buttonText, setButtonText] =
    useState("");

  const [buttonLink, setButtonLink] =
    useState("");

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
    useState("");

  // =========================================================
  // FETCH BANNER + CATEGORIES
  // =========================================================

  const fetchData = async () => {
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

      if (!id) {
        toast.error(
          "Banner ID is missing"
        );
        return;
      }

      const [
        bannerResponse,
        categoryResponse,
      ] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_URL}/api/banner/admin`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        ),

        axios.get(
          `${import.meta.env.VITE_API_URL}/api/category`
        ),
      ]);

      const banners =
        bannerResponse.data?.banners ||
        [];

      const foundBanner =
        banners.find(
          (item: Banner) =>
            item._id === id
        );

      if (!foundBanner) {
        toast.error(
          "Banner not found"
        );

        navigate(
          "/banners"
        );

        return;
      }

      setBanner(foundBanner);

      setTitle(
        foundBanner.title || ""
      );

      setSubtitle(
        foundBanner.subtitle || ""
      );

      setButtonText(
        foundBanner.buttonText ||
          ""
      );

      setButtonLink(
        foundBanner.buttonLink ||
          ""
      );

      setCategory(
        foundBanner.category?._id ||
          ""
      );

      setDisplayOrder(
        String(
          foundBanner.displayOrder ??
            0
        )
      );

      setStatus(
        foundBanner.status
      );

      setPreview(
        foundBanner.image || ""
      );

      setCategories(
        categoryResponse.data
          ?.categories || []
      );

    } catch (error: unknown) {
      console.error(
        "Fetch edit banner error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch banner";

      toast.error(
        message ||
          "Failed to fetch banner"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // =========================================================
  // IMAGE CHANGE
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
  // UPDATE
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

    if (!id) {
      return;
    }

    try {
      setSaving(true);

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

      // Only send image when a new one is selected
      if (image) {
        formData.append(
          "image",
          image
        );
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/banner/admin/${id}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Banner updated successfully"
      );

      navigate(
        `/banners/${id}`
      );

    } catch (error: unknown) {
      console.error(
        "Update banner error:",
        error
      );

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to update banner";

      toast.error(
        message ||
          "Failed to update banner"
      );

    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <CardBox>
        <div className="py-12 text-center text-gray-500">
          Loading banner...
        </div>
      </CardBox>
    );
  }

  if (!banner) {
    return (
      <CardBox>
        <div className="py-12 text-center text-gray-500">
          Banner not found
        </div>
      </CardBox>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() =>
            navigate(
              `/banners/${id}`
            )
          }
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          Back to Banner
        </button>

        <h2 className="text-2xl font-semibold">
          Edit Banner
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update banner information
        </p>

      </div>


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* INFORMATION */}

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
                  setTitle(
                    e.target.value
                  )
                }
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

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />

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
                `/banners/${id}`
              )
            }
            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving
              ? "Updating..."
              : "Update Banner"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditBanner;