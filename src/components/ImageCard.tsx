import { Calendar, Download, Eye, Heart, Share2 } from "lucide-react";

export const ImageCard = ({ image  }) => (
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