import { Download, Eye, Heart, Share2, Trash2 } from "lucide-react";

export const ListView = ({ image }) => (
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
