import React, { useState, useRef } from "react";
import { Upload, Video, X, Clock, Shield, Zap } from "lucide-react";
import { useUploadVideo } from "@/api/video";

function VideoUpload() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate } = useUploadVideo();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const videoFiles = droppedFiles.filter((file) =>
      file.type.startsWith("video/")
    );

    if (videoFiles.length > 0) {
      addFiles(videoFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]): void => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number): void => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startUpload = async (): Promise<void> => {
    setUploading(true);

    // Simulate upload progress
    mutate(files);

    setUploading(false);
  };

  const formatFileSize = (sizeInBytes: number): string => {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      {/* <Nav /> */}
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-6">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Video Upload Center
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload and manage your video content with our secure, professional
              platform.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="video/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                    dragActive ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <Upload
                    className={`w-8 h-8 transition-colors duration-200 ${
                      dragActive ? "text-blue-600" : "text-gray-600"
                    }`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {dragActive ? "Drop videos here" : "Upload video files"}
                  </h3>
                  <p className="text-gray-600">
                    Drag and drop your files or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      browse from computer
                    </button>
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    MP4
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    AVI
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    MOV
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    WMV
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    MKV
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>
                Maximum file size: 2GB per file. Supported formats: MP4, AVI,
                MOV, WMV, MKV, WebM
              </p>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Queue ({files.length}{" "}
                  {files.length === 1 ? "file" : "files"})
                </h3>
                {files.length > 0 && !uploading && (
                  <button
                    onClick={startUpload}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Start Upload
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0">
                        <Video className="w-6 h-6 text-gray-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                          {file.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>

                        {uploading && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 w-1/2" />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              Uploading...
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {!uploading && (
                          <button
                            onClick={() => removeFile(index)}
                            className="w-6 h-6 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fast Processing
              </h3>
              <p className="text-gray-600">
                Optimized upload speeds with real-time progress tracking and
                efficient compression.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enterprise Security
              </h3>
              <p className="text-gray-600">
                Bank-level encryption and secure cloud storage with compliance
                certifications.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                24/7 Availability
              </h3>
              <p className="text-gray-600">
                Reliable uptime with automated backups and instant accessibility
                from anywhere.
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              By uploading files, you agree to our Terms of Service and Privacy
              Policy. All uploads are secured with SSL encryption.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoUpload;
