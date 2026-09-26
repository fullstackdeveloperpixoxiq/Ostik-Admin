import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const EditVideoSection = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [buttonText, setButtonText] =
    useState("");
  const [buttonLink, setButtonLink] =
    useState("");
  const [isActive, setIsActive] =
    useState(true);

  const [videoFile, setVideoFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const adminToken =
    localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchVideoSection = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/video-section/admin`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        const data = response.data.data;

        setTitle(data.title || "");
        setDescription(
          data.description || ""
        );
        setVideoUrl(data.videoUrl || "");
        setButtonText(
          data.buttonText || ""
        );
        setButtonLink(
          data.buttonLink || ""
        );
        setIsActive(
          data.isActive ?? true
        );
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch video section"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideoSection();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append(
        "description",
        description
      );
      formData.append("videoUrl", videoUrl);
      formData.append(
        "buttonText",
        buttonText
      );
      formData.append(
        "buttonLink",
        buttonLink
      );
      formData.append(
        "isActive",
        String(isActive)
      );

      if (videoFile) {
        formData.append("video", videoFile);
      }

      await axios.put(
        `${API_URL}/api/video-section/admin/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success(
        "Video section updated successfully"
      );

      navigate("/ostik-admin/video-section");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update video section"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">

        <button
          onClick={() =>
            navigate("/ostik-admin/video-section")
          }
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Video Section
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Update the homepage video section.
          </p>
        </div>

      </div>


      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-6"
      >

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={4}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video URL
          </label>

          <input
            type="url"
            value={videoUrl}
            onChange={(e) =>
              setVideoUrl(e.target.value)
            }
            className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          />

          <p className="text-xs text-gray-500 mt-1">
            Leave as it is to keep the current video.
            Uploading a new video will replace it.
          </p>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Replace Video
          </label>

          <label className="border-2 border-dashed border-gray-300 rounded-xl min-h-[130px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

            <Upload
              size={26}
              className="text-gray-400"
            />

            <span className="text-sm text-gray-600 mt-2">
              {videoFile
                ? videoFile.name
                : "Click to select a new video"}
            </span>

            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) =>
                setVideoFile(
                  e.target.files?.[0] || null
                )
              }
            />

          </label>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
            </label>

            <input
              type="text"
              value={buttonText}
              onChange={(e) =>
                setButtonText(e.target.value)
              }
              className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Link
            </label>

            <input
              type="text"
              value={buttonLink}
              onChange={(e) =>
                setButtonLink(e.target.value)
              }
              className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

        </div>


        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
            className="w-4 h-4"
          />

          <span className="text-sm text-gray-700">
            Active
          </span>

        </div>


        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">

          <button
            type="button"
            onClick={() =>
              navigate("/ostik-admin/video-section")
            }
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditVideoSection;