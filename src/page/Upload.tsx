import React, { useState } from "react";
import { Image, Video } from "lucide-react";

import VideoUpload from "../components/VideoUpload";
import ImageUpload from "../components/ImageUpload";
import Nav from "@/components/Nav";

const Upload: React.FC = () => {
  const [currentView, setCurrentView] = useState<"image" | "video">("image");

  return (
    <>
      <Nav />
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView("image")}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentView === "image"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Image className="w-4 h-4 mr-2" />
              Upload Images
            </button>
            <button
              onClick={() => setCurrentView("video")}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentView === "video"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Video className="w-4 h-4 mr-2" />
              Upload Videos
            </button>
          </div>
        </div>
      </div>

      {currentView === "video" ? <VideoUpload /> : <ImageUpload />}
    </>
  );
};
export default Upload;
