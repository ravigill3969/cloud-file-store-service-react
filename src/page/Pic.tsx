import { useState } from "react";
import {
  Search,
  Grid,
  List,
  Download,
  Heart,
  Share2,
  Trash2,
  Eye,
  Calendar,
  Camera,
} from "lucide-react";
import Nav from "@/components/Nav";

function Pic() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data for uploaded images
  const mockImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      title: "Mountain Sunrise",
      uploadDate: "2024-01-15",
      size: "2.4 MB",
      format: "JPG",
      dimensions: "1920x1080",
      likes: 24,
      views: 156,
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      title: "Forest Path",
      uploadDate: "2024-01-12",
      size: "3.1 MB",
      format: "PNG",
      dimensions: "2048x1536",
      likes: 18,
      views: 89,
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
      title: "Starry Night",
      uploadDate: "2024-01-10",
      size: "1.8 MB",
      format: "JPG",
      dimensions: "1600x1200",
      likes: 42,
      views: 234,
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
      title: "Lake Reflection",
      uploadDate: "2024-01-08",
      size: "2.9 MB",
      format: "JPG",
      dimensions: "1920x1440",
      likes: 31,
      views: 178,
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
      title: "Autumn Leaves",
      uploadDate: "2024-01-05",
      size: "2.2 MB",
      format: "PNG",
      dimensions: "1800x1200",
      likes: 15,
      views: 92,
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      title: "Ocean Waves",
      uploadDate: "2024-01-03",
      size: "3.5 MB",
      format: "JPG",
      dimensions: "2560x1440",
      likes: 28,
      views: 145,
    },
  ];

  const filteredImages = mockImages.filter((image) => {
    const matchesSearch = image.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || image.format.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const ImageCard = ({ image }) => (
    <>
      <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Overlay actions */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
              <Heart className="w-4 h-4 text-gray-700" />
            </button>
            <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>
            <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
              <Download className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Bottom overlay info */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-4 text-white text-sm">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{image.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{image.likes}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {image.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(image.uploadDate).toLocaleDateString()}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
              {image.format}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{image.dimensions}</span>
            <span>{image.size}</span>
          </div>
        </div>
      </div>
    </>
  );

  const ListView = ({ image }) => (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <img
        src={image.url}
        alt={image.title}
        className="w-16 h-16 object-cover rounded-lg mr-4"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{image.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{image.format}</span>
          <span>{image.dimensions}</span>
          <span>{image.size}</span>
          <span>{new Date(image.uploadDate).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-500 mr-4">
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {image.views}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          {image.likes}
        </span>
      </div>
      <div className="flex gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Download className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Share2 className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-red-100 rounded-full transition-colors">
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  My Gallery
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Discover and manage your uploaded memories
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                >
                  <option value="all">All Formats</option>
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="gif">GIF</option>
                </select>

                <div className="flex bg-white/70 backdrop-blur-sm rounded-xl border border-gray-300 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Bar */}
          <div className="flex items-center gap-6 mb-8 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {filteredImages.length} images
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {mockImages.reduce((acc, img) => acc + img.views, 0)} total views
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {mockImages.reduce((acc, img) => acc + img.likes, 0)} total likes
            </span>
          </div>

          {/* Image Grid/List */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No images found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredImages.map((image) => (
                    <ImageCard key={image.id} image={image} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredImages.map((image) => (
                    <ListView key={image.id} image={image} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Pic;
