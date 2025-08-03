import { useEffect, useState } from "react";
import { Trash2, RotateCcw, AlertCircle } from "lucide-react";

import { base_url } from "../api/API";
import Nav from "@/components/Nav";
import { useGetDeletedImages, useRecoverDeletedImage } from "@/api/file";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

function DeletedImages() {
  const { data, isSuccess, isLoading, error } = useGetDeletedImages();
  const [images, setImages] = useState<string[]>([]);
  const [recoveringImages, setRecoveringImages] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (data && isSuccess && data.data) {
      setImages(data.data);
    } else if (isSuccess && (!data || !data.data)) {
      setImages([]);
    }
  }, [isSuccess, data]);

  const { mutate } = useRecoverDeletedImage();

  const handleRecover = (imageId: string) => {
    setRecoveringImages((prev) => new Set(prev).add(imageId));
    mutate(imageId, {
      onSuccess: () => {
        setRecoveringImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
        setImages((prev) => prev.filter((id) => id !== imageId));
      },
      onError: () => {
        setRecoveringImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">
                  Loading deleted images...
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="container mx-auto px-6 py-8">
            <Alert className="max-w-2xl mx-auto mt-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load deleted images. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">
                    Deleted Images
                  </h1>
                  <p className="text-slate-600">
                    Manage your deleted images and recover them if needed
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium"
              >
                {images.length} {images.length === 1 ? "image" : "images"}
              </Badge>
            </div>
          </div>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {images.map((imageId) => (
                <Card
                  key={imageId}
                  className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md  hover:-translate-y-1"
                >
                  <CardContent className="p-0">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden rounded-t-lg bg-slate-100">
                      <img
                        src={`${base_url}/api/file/get-file/${imageId}`}
                        crossOrigin="anonymous"
                        alt={`Deleted image ${imageId}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onLoad={() => {
                          console.log(`Image ${imageId} loaded successfully`);
                        }}
                        onError={(e) => {
                          console.error(`Failed to load image ${imageId}`);
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml;base64,${btoa(`
                            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                              <rect width="100%" height="100%" fill="#f1f5f9"/>
                              <circle cx="200" cy="120" r="30" fill="#cbd5e1"/>
                              <rect x="185" y="105" width="30" height="20" rx="2" fill="#f1f5f9"/>
                              <circle cx="195" cy="112" r="3" fill="#cbd5e1"/>
                              <text x="50%" y="180" text-anchor="middle" font-family="Arial" font-size="12" fill="#64748b">
                                Image not available
                              </text>
                            </svg>
                          `)}`;
                        }}
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Action Button */}
                    <div className="p-4">
                      <Button
                        onClick={() => handleRecover(imageId)}
                        disabled={recoveringImages.has(imageId)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors duration-200"
                        size="sm"
                      >
                        {recoveringImages.has(imageId) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Recovering...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Recover
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="max-w-md text-center">
                <div className="p-6 bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  No deleted images found
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Your recycle bin is empty. Deleted images will appear here and
                  can be recovered within the retention period.
                </p>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Images are automatically permanently
                    deleted after 7 days in the recycle bin.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DeletedImages;
