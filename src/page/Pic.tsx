import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Image as ImageIcon,
  Info,
  Trash,
  Upload,
  X,
  AlertCircle,
  FolderOpen,
  Edit,
} from "lucide-react";
import Nav from "@/components/Nav";
import { useDeleteImage, useGetAllFilesWithUserID } from "@/api/file";
import type { ImageData } from "@/api/APITypesFile";
import { Link } from "react-router";
import DimensionPopup from "@/components/DimensionPopup";

const base_url = import.meta.env.VITE_BACKEND_URL;

const Pic: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());
  const [showEdit, setShowEdit] = useState(false);

  const { mutate } = useDeleteImage();
  const { data, isLoading, error } = useGetAllFilesWithUserID();

  useEffect(() => {
    const loadImages = async () => {
      if (data && data.data && Array.isArray(data.data)) {
        setImages(data.data);
      } else if (data && !data.data) {
        // Handle case where API returns success but no data
        setImages([]);
      } else {
        setImages([]);
      }
    };

    loadImages();
  }, [data]);

  const handleDelete = (id: string) => {
    setDeletingImages((prev) => new Set(prev).add(id));
    mutate(id, {
      onSuccess: () => {
        setDeletingImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        // Remove deleted image from the list
        setImages((prev) => prev.filter((img) => img.id !== id));
        // Close modal if the deleted image was selected
        if (selectedImage && selectedImage.id === id) {
          setSelectedImage(null);
        }
      },
      onError: () => {
        setDeletingImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      },
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatFileSize = (width: number, height: number) => {
    if (!width || !height) return "Unknown size";
    return `${width} × ${height}`;
  };

  const getMimeTypeColor = (mimeType: string) => {
    if (!mimeType) return "bg-gray-100 text-gray-800";

    switch (mimeType.toLowerCase()) {
      case "image/jpeg":
      case "image/jpg":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "image/png":
        return "bg-green-100 text-green-800 border-green-200";
      case "image/gif":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "image/webp":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "image/svg+xml":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFileExtension = (mimeType: string) => {
    if (!mimeType) return "IMG";
    return mimeType.replace("image/", "").toUpperCase();
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-md">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 flex-1" />
                      <Skeleton className="h-8 flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
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
            <Alert className="max-w-2xl mx-auto mt-8 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to load images. Please try again later.
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
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <ImageIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">
                    Image Gallery
                  </h1>
                  <p className="text-slate-600">
                    Manage and view your uploaded images
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium"
                >
                  {images.length} {images.length === 1 ? "image" : "images"}
                </Badge>
                <Link to="/deleted-images">
                  <Button variant="outline" className="gap-2">
                    <Trash className="h-4 w-4" />
                    Deleted Images
                  </Button>
                </Link>
                <Link to="/upload">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <Card
                  key={image.id || index}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1"
                >
                  {showEdit && (
                    <DimensionPopup
                      open={showEdit}
                      onOpenChange={setShowEdit}
                      iid={image.id}
                    />
                  )}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={`${base_url}/api/file/get-file/${image.id}`}
                      alt={image.original_filename || "Untitled image"}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      onClick={() => setSelectedImage(image)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml;base64,${btoa(`
                          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="#f1f5f9"/>
                            <circle cx="200" cy="120" r="30" fill="#cbd5e1"/>
                            <rect x="185" y="105" width="30" height="20" rx="2" fill="#f1f5f9"/>
                            <circle cx="195" cy="112" r="3" fill="#cbd5e1"/>
                            <text x="50%" y="180" text-anchor="middle" font-family="Arial" font-size="12" fill="#64748b">
                              Image unavailable
                            </text>
                          </svg>
                        `)}`;
                      }}
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={`${getMimeTypeColor(
                          image.mime_type
                        )} border font-medium`}
                      >
                        {getFileExtension(image.mime_type)}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle
                      className="text-lg truncate font-semibold text-slate-800"
                      title={image.original_filename || "Untitled"}
                    >
                      {image.original_filename || "Untitled"}
                    </CardTitle>
                    <CardDescription className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(image.upload_date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <ImageIcon className="h-3 w-3" />
                        {formatFileSize(image.width, image.height)}
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedImage(image)}
                        className="flex-1 border-slate-300 hover:bg-slate-50"
                      >
                        <Info className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEdit(!showEdit)}
                        className="flex-1 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => handleDelete(image.id)}
                        disabled={deletingImages.has(image.id)}
                      >
                        {deletingImages.has(image.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
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
                  <FolderOpen className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  No images found
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  You haven't uploaded any images yet. Start building your
                  gallery by uploading your first image.
                </p>
                <Link to="/upload">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4" />
                    Upload Your First Image
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-slate-900">
                        {selectedImage.original_filename || "Untitled"}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          {formatFileSize(
                            selectedImage.width,
                            selectedImage.height
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(selectedImage.upload_date)}
                        </div>
                        <Badge
                          className={getMimeTypeColor(selectedImage.mime_type)}
                        >
                          {selectedImage.mime_type || "Unknown"}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImage(null)}
                      className="hover:bg-slate-200"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <img
                      src={`${base_url}/api/file/get-file/${selectedImage.id}`}
                      alt={selectedImage.original_filename || "Untitled"}
                      crossOrigin="anonymous"
                      className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml;base64,${btoa(`
                          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="#f1f5f9"/>
                            <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="#64748b">
                              Failed to load image
                            </text>
                          </svg>
                        `)}`;
                      }}
                    />
                  </div>

                  <Button
                    onClick={() => handleDelete(selectedImage.id)}
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    disabled={deletingImages.has(selectedImage.id)}
                  >
                    {deletingImages.has(selectedImage.id) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Pic;
