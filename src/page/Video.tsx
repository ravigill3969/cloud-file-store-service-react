import { useEffect, useState } from "react";
import {
  Play,
  Download,
  Share2,
  Calendar,
  Clock,
  Eye,
  Film,
  Search,
  Filter,
  Trash2,
} from "lucide-react";
import Nav from "@/components/Nav";
import {
  useDeleteVideoWithCookie,
  useGetUploadedVideosWithCookie,
} from "@/api/video";
import { useNavigate } from "react-router";
import { base_url } from "../api/API";
// Video data interface matching your database structure
interface VideoData {
  vid: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  url: string;
}

function Video() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<VideoData[] | []>([]);
  const navigate = useNavigate();
  const { mutate } = useDeleteVideoWithCookie();

  const { data, isSuccess } = useGetUploadedVideosWithCookie();

  useEffect(() => {
    if (isSuccess && data && data.data) {
      setVideos(data.data);
    }
  }, [data, isSuccess]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const filteredVideos = videos.filter((video) =>
    video.original_filename.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalStorageUsed = videos.reduce(
    (acc, video) => acc + video.file_size_bytes,
    0,
  );

  const deleteVideo = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        setVideos((prev) => prev.filter((video) => video.vid !== id));
      },
    });
  };

  const playVideo = (id: string) => {
    navigate("/video-player", {
      state: { link: `${base_url}/api/video/watch/?vid=${id}` },
    });
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-blue-50/20">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  My Videos
                </h1>
                <p className="text-slate-600">
                  Manage and view your uploaded video content
                </p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 font-medium">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Total Videos
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {videos.length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Film className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Storage Used
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatFileSize(totalStorageUsed)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Avg File Size
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {videos.length > 0
                      ? formatFileSize(totalStorageUsed / videos.length)
                      : "0 MB"}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Recent Uploads
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {/* {
                      // videos.filter(() => {
                      //   // const uploadDate = new Date(Date.now());
                      //   const weekAgo = new Date();
                      //   weekAgo.setDate(weekAgo.getDate() - 7);
                      //   return uploadDate > weekAgo;
                      }).length
                    } */}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
                <Film className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {videos.length === 0
                  ? "No videos uploaded yet"
                  : "No videos match your search"}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                {videos.length === 0
                  ? "Upload your first video to get started with your video library."
                  : "Try adjusting your search terms or clear the search to see all videos."}
              </p>
            </div>
          )}

          {/* Video Grid/List */}
          {filteredVideos.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden">
              <div className="divide-y divide-slate-200/50">
                {filteredVideos.map((video) => (
                  <div
                    key={video.vid}
                    className="flex items-center p-6 hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex-shrink-0 w-16 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center mr-4">
                      <Play
                        onClick={() => playVideo(video.vid)}
                        className="w-6 h-6 text-slate-600"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate mb-1">
                        {video.original_filename.replace(/\.[^/.]+$/, "")}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        {/* <span>{formatDate(video.upload_date)}</span> */}
                        <span>{formatFileSize(video.file_size_bytes)}</span>
                        <span>{video.mime_type}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        {/* <Link to={video.url}> */}
                        <Download className="w-4 h-4 text-slate-600" />
                        {/* </Link> */}
                      </button>
                      <button
                        onClick={() => deleteVideo(video.vid)}
                        className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>{" "}
    </>
  );
}

export default Video;
