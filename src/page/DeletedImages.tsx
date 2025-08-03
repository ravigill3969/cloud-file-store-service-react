import { useEffect, useState } from "react";
import { Trash2, RotateCcw, AlertCircle, X } from "lucide-react";

import { base_url } from "../api/API";
import Nav from "@/components/Nav";
import {
  useGetDeletedImages,
  useRecoverDeletedImage,
  useDeleteDeletedImagesPermanently,
} from "@/api/file";
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
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data && isSuccess && data.data) {
      setImages(data.data);
    } else if (isSuccess && (!data || !data.data)) {
      // Handle case where response is null or data is null
      setImages([]);
    }
  }, [isSuccess, data]);

  const { mutate } = useRecoverDeletedImage();
  const { mutate: deleteImagePermanently } =
    useDeleteDeletedImagesPermanently();

  const handleRecover = (imageId: string) => {
    setRecoveringImages((prev) => new Set(prev).add(imageId));
    mutate(imageId, {
      onSuccess: () => {
        setRecoveringImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
        // Remove the recovered image from the list
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

  const handleDelete = (imageId: string) => {
    setDeletingImages((prev) => new Set(prev).add(imageId));
    deleteImagePermanently(imageId, {
      onSuccess: () => {
        setDeletingImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
        // Remove the permanently deleted image from the list
        setImages((prev) => prev.filter((id) => id !== imageId));
      },
      onError: () => {
        setDeletingImages((prev) => {
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
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl shadow-lg">
                  <Trash2 className="h-10 w-10 text-red-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    Deleted Images
                  </h1>
                  <p className="text-lg text-slate-600">
                    Manage your deleted images and recover them if needed
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="px-6 py-3 text-lg font-semibold bg-slate-100 text-slate-700 rounded-full"
              >
                {images.length} {images.length === 1 ? "image" : "images"}
              </Badge>
            </div>
          </div>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {images.map((imageId) => (
                <Card
                  key={imageId}
                  className="group bg-white transition-all duration-500 border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 rounded-2xl overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                      <img
                        src={`${base_url}/api/file/get-file/${imageId}`}
                        crossOrigin="anonymous"
                        alt={`Deleted image ${imageId}`}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        onLoad={() => {
                          console.log(`Image ${imageId} loaded successfully`);
                        }}
                        onError={(e) => {
                          console.error(`Failed to load image ${imageId}`);
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml;base64,${btoa(`
                            <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" style="stop-color:#f1f5f9;stop-opacity:1" />
                                  <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
                                </linearGradient>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#grad)"/>
                              <circle cx="200" cy="160" r="40" fill="#cbd5e1" opacity="0.6"/>
                              <rect x="180" y="140" width="40" height="28" rx="4" fill="#f1f5f9"/>
                              <circle cx="190" cy="150" r="4" fill="#cbd5e1"/>
                              <path d="M180 168 L200 148 L220 168 Z" fill="#cbd5e1" opacity="0.8"/>
                              <text x="50%" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#64748b" font-weight="500">
                                Image not available
                              </text>
                              <text x="50%" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8">
                                File may be corrupted
                              </text>
                            </svg>
                          `)}`;
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-500/90 text-white backdrop-blur-sm border-0 text-xs font-medium px-2 py-1">
                          Deleted
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 space-y-3 bg-white">
                      <Button
                        onClick={() => handleRecover(imageId)}
                        disabled={
                          recoveringImages.has(imageId) ||
                          deletingImages.has(imageId)
                        }
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        size="default"
                      >
                        {recoveringImages.has(imageId) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                            Recovering...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-4 w-4 mr-3" />
                            Recover Image
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleDelete(imageId)}
                        disabled={
                          recoveringImages.has(imageId) ||
                          deletingImages.has(imageId)
                        }
                        variant="destructive"
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        size="default"
                      >
                        {deletingImages.has(imageId) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-3" />
                            Delete Forever
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
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="max-w-lg text-center">
                <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Trash2 className="h-16 w-16 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  No deleted images found
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  Your recycle bin is empty. Deleted images will appear here and
                  can be recovered within the retention period.
                </p>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
                  <p className="text-sm text-blue-800 font-medium">
                    <strong>💡 Tip:</strong> Images are automatically permanently
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