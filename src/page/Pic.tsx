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
import { CalendarDays, Download, Image as ImageIcon, Info } from "lucide-react";
import Nav from "@/components/Nav";
import { useGetAllFilesWithUserID } from "@/api/file";
import type { ImageData } from "@/api/APITypesFile";
import { Link } from "react-router";

const base_url = import.meta.env.VITE_BACKEND_URL;

const Pic: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const { data, isLoading, error } = useGetAllFilesWithUserID();

  useEffect(() => {
    const loadImages = async () => {
      if (data && data.data != null) {
        setImages(data.data);
      } else {
        setImages([]);
      }
    };

    loadImages();
  }, [data]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (width: number, height: number) => {
    return `${width} × ${height}`;
  };

  const getMimeTypeColor = (mimeType: string) => {
    switch (mimeType) {
      case "image/jpeg":
        return "bg-blue-100 text-blue-800";
      case "image/png":
        return "bg-green-100 text-green-800";
      case "image/gif":
        return "bg-purple-100 text-purple-800";
      case "image/webp":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const downloadImage = async (imageData: ImageData) => {
    console.log(imageData);
  };

  if (isLoading) {
    return (
      <>
        <Nav />
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Image Gallery</h1>
            <p className="text-gray-600">Loading your images...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Image Gallery</h1>
          <p className="text-gray-600 mb-4">
            {images.length} {images.length === 1 ? "image" : "images"} available
          </p>
          <Link className="" to={"/upload"}>
            <Button>Upload</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={`${base_url}/api/file/get/${image.id}`}
                  alt={image.original_filename}
                  crossOrigin="anonymous"
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                  onError={(e) => {
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
                <div className="absolute top-2 right-2">
                  <Badge className={getMimeTypeColor(image.mime_type)}>
                    {image.mime_type.replace("image/", "").toUpperCase()}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle
                  className="text-lg truncate"
                  title={image.original_filename}
                >
                  {image.original_filename}
                </CardTitle>
                <CardDescription className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(image.upload_date)}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <ImageIcon className="h-3 w-3" />
                    {formatFileSize(image.width, image.height)}
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedImage(image)}
                    className="flex-1"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadImage(image)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      {selectedImage.original_filename}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        {formatFileSize(
                          selectedImage.width,
                          selectedImage.height
                        )}
                      </span>
                      <span>{formatDate(selectedImage.upload_date)}</span>
                      <Badge
                        className={getMimeTypeColor(selectedImage.mime_type)}
                      >
                        {selectedImage.mime_type}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                  >
                    ×
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <img
                  src={`${base_url}/api/file/get/${selectedImage.id}`}
                  alt={selectedImage.original_filename}
                  crossOrigin="anonymous"
                  className="max-w-full max-h-[60vh] object-contain mx-auto"
                  onError={(err) => console.log(err)}
                />
              </div>

              <div className="p-4 border-t">
                <Button
                  onClick={() => downloadImage(selectedImage)}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download {selectedImage.original_filename}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Pic;
