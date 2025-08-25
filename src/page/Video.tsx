import { useEffect, useState } from "react";
import {
  Play,
  Download,
  Share2,
  MoreHorizontal,
  Calendar,
  Clock,
  Eye,
  Film,
  Search,
  Filter,
  Grid3X3,
  List,
  Trash2,
} from "lucide-react";
import Nav from "@/components/Nav";
import { useGetUploadedVideosWithUserID } from "@/api/video";

// Video data interface matching your database structure
interface VideoData {
  vid: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  url: string;
}

function Video() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const [videos, setVideos] = useState<VideoData[] | []>([]);

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //   });
  // };

  const { data, isSuccess } = useGetUploadedVideosWithUserID();

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

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "VIDEO";
  };

  const filteredVideos = videos.filter((video) =>
    video.original_filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStorageUsed = videos.reduce(
    (acc, video) => acc + video.file_size_bytes,
    0
  );

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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-white text-purple-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-white text-purple-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
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
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.vid}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                      {/* Video Preview Area */}
                      <div className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="relative z-10 flex flex-col items-center space-y-3">
                          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full group-hover:bg-white/30 transition-colors cursor-pointer">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                          <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                            <span className="text-white text-sm font-medium">
                              {getFileExtension(video.original_filename)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                            {video.original_filename.replace(/\.[^/.]+$/, "")}
                          </h3>
                          <button className="p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            {/* <span>{formatDate(video.upload_date)}</span> */}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatFileSize(video.file_size_bytes)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{video.mime_type}</span>
                          <div className="flex items-center space-x-1">
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden">
                  <div className="divide-y divide-slate-200/50">
                    {filteredVideos.map((video) => (
                      <div
                        key={video.vid}
                        className="flex items-center p-6 hover:bg-slate-50/50 transition-colors group"
                      >
                        <div className="flex-shrink-0 w-16 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center mr-4">
                          <Play className="w-6 h-6 text-slate-600" />
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
                            <Download className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>{" "}
    </>
  );
}

export default Video;

<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
  <h1 className="text-2xl mb-4">Video Player</h1>
  <video
    controls
    width="720"
    height="405"
    className="rounded-lg shadow-lg bg-black"
    crossOrigin="anonymous"
    preload="none"
  >
    <source
      src="http://localhost:8080/api/video/watch/?vid=2dc4624c-b729-4f76-a236-9d59aa96e5c4"
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
</div>;
