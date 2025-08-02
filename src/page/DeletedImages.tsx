import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { base_url } from "../api/API";
import Nav from "@/components/Nav";
import { useGetDeletedImages } from "@/api/file";
import { Button } from "@/components/ui/button";

function DeletedImages() {
  const { data, isSuccess } = useGetDeletedImages();

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (data && isSuccess) {
      setImages(data.data);
    }
  }, [isSuccess, data]);

  const handleRecover = (imageId: string) => {
    // Add your recover logic here
    console.log("Recovering image:", imageId);
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Trash2 className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Deleted Images</h1>
          </div>
          <p className="text-gray-600">{images.length} deleted images</p>
        </div>

        {/* Images Grid */}
        {images.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {images.map((imageId) => (
                <div
                  key={imageId}
                  className=" bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col  justify-between"
                >
                  {/* Image */}
                  <div className="relative aspect-square ">
                    <img
                      src={`${base_url}/api/file/get-file/${imageId}`}
                      crossOrigin="anonymous"
                      alt={`Deleted image ${imageId}`}
                      className="w-full h-full object-contain cursor-pointer"
                      onLoad={() => {
                        console.log(`Image ${imageId} loaded successfully`);
                      }}
                      onError={(e) => {
                        console.error(`Failed to load image ${imageId}`);
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f3f4f6"/>
                          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="#6b7280">
                            Failed to load image
                          </text>
                        </svg>
                      `)}`;
                      }}
                    />
                  </div>
                  <Button variant={"destructive"}>Recover</Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No deleted images
            </h3>
            <p className="text-gray-500">Your recycle bin is empty.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default DeletedImages;
