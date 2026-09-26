import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  Video,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface VideoSectionData {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const VideoSection = () => {
  const navigate = useNavigate();

  const [videoSection, setVideoSection] =
    useState<VideoSectionData | null>(null);

  const [loading, setLoading] = useState(true);

  const adminToken =
    localStorage.getItem("adminToken");

  const fetchVideoSection = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/video-section/admin`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setVideoSection(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setVideoSection(null);
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch video section"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoSection();
  }, []);

  const handleDelete = async () => {
    if (!videoSection) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this video section?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/api/video-section/admin/${videoSection._id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success(
        "Video section deleted successfully"
      );

      setVideoSection(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete video section"
      );
    }
  };

  const isYouTubeUrl = (url: string) => {
    return (
      url.includes("youtube.com") ||
      url.includes("youtu.be")
    );
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);

      if (url.includes("youtu.be")) {
        const id =
          parsedUrl.pathname.substring(1);

        return `https://www.youtube.com/embed/${id}`;
      }

      const videoId =
        parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return url;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">
          Loading video section...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Video Section
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage the video section displayed on the
            customer homepage.
          </p>
        </div>

        {!videoSection && (
          <button
            onClick={() =>
              navigate("/ostik-admin/video-section/add")
            }
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Video Section
          </button>
        )}
      </div>


      {/* EMPTY STATE */}
      {!videoSection && (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Video size={26} className="text-gray-500" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No Video Section
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Create a video section to display on the
            homepage.
          </p>

        </div>
      )}


      {/* VIDEO SECTION */}
      {videoSection && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* TOP */}
          <div className="p-5 border-b border-gray-200 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

            <div>
              <div className="flex items-center gap-3">

                <h2 className="text-xl font-semibold text-gray-900">
                  {videoSection.title}
                </h2>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    videoSection.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {videoSection.isActive
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                {videoSection.description}
              </p>
            </div>


            {/* ACTIONS */}
            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  navigate(
                    `/ostik-admin/video-section/edit/${videoSection._id}`
                  )
                }
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"
              >
                <Trash2 size={16} />
                Delete
              </button>

            </div>
          </div>


          {/* VIDEO PREVIEW */}
          <div className="p-5">

            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Video Preview
            </h3>

            <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black">

              {isYouTubeUrl(
                videoSection.videoUrl
              ) ? (
                <iframe
                  src={getYouTubeEmbedUrl(
                    videoSection.videoUrl
                  )}
                  title={videoSection.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoSection.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              )}

            </div>
          </div>


          {/* INFO */}
          <div className="border-t border-gray-200 p-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <p className="text-xs text-gray-500">
                  Button Text
                </p>

                <p className="text-sm font-medium text-gray-900 mt-1">
                  {videoSection.buttonText}
                </p>
              </div>


              <div>
                <p className="text-xs text-gray-500">
                  Button Link
                </p>

                <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                  {videoSection.buttonLink}
                </p>
              </div>


              <div>
                <p className="text-xs text-gray-500">
                  Video URL
                </p>

                <a
                  href={videoSection.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1 break-all"
                >
                  Open Video
                  <ExternalLink size={14} />
                </a>
              </div>


              <div>
                <p className="text-xs text-gray-500">
                  Last Updated
                </p>

                <p className="text-sm font-medium text-gray-900 mt-1">
                  {new Date(
                    videoSection.updatedAt
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default VideoSection;