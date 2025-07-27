import React, {
  useState,
  useCallback,
  type JSX,
  type DragEvent,
  type ChangeEvent,
} from "react";
import {
  X,
  File,
  Image,
  FileText,
  Archive,
  Music,
  Video,
  Upload as UploadIcon,
  CheckCircle,
  AlertCircle,
  Cloud,
  FolderUp,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useUploadFiles } from "@/api/file";
import Nav from "@/components/Nav";

const Upload: React.FC = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const { mutate, data, isPending, error } = useUploadFiles();

  const getFileIcon = (file: File): JSX.Element => {
    const type = file.type;
    if (type.startsWith("image/"))
      return <Image className="w-5 h-5 text-blue-500" />;
    if (type.startsWith("video/"))
      return <Video className="w-5 h-5 text-purple-500" />;
    if (type.startsWith("audio/"))
      return <Music className="w-5 h-5 text-green-500" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes("zip") || type.includes("archive"))
      return <Archive className="w-5 h-5 text-orange-500" />;
    return <File className="w-5 h-5 text-slate-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setUploadStatus("idle");
    }
  }, []);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setUploadStatus("idle");
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
    setUploadStatus("idle");
  };

  const handleUpload = () => {
    if (files.length === 0) return;

    setUploadStatus("uploading");
    mutate(files, {
      onSuccess: (response) => {
        setUploadStatus("success");
        console.log("Upload successful:", response);
      },
      onError: (error) => {
        setUploadStatus("error");
        console.error("Upload failed:", error);
      },
    });
  };

  const retryUpload = () => {
    setUploadStatus("idle");
    handleUpload();
  };

  const getUploadStatusColor = () => {
    switch (uploadStatus) {
      case "uploading":
        return "border-blue-300 bg-blue-50";
      case "success":
        return "border-green-300 bg-green-50";
      case "error":
        return "border-red-300 bg-red-50";
      default:
        return dragActive
          ? "border-emerald-400 bg-emerald-50"
          : "border-slate-300 bg-slate-50";
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
              <Cloud className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              File Upload Center
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Securely upload and manage your files with our advanced cloud
              storage system
            </p>
          </div>

          {/* Main Upload Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Upload Zone */}
            <div className="p-8">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${getUploadStatusColor()}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isPending}
                />

                <div className="flex flex-col items-center space-y-6">
                  {/* Icon */}
                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                        uploadStatus === "uploading"
                          ? "bg-blue-100"
                          : uploadStatus === "success"
                          ? "bg-green-100"
                          : uploadStatus === "error"
                          ? "bg-red-100"
                          : dragActive
                          ? "bg-emerald-100"
                          : "bg-slate-100"
                      }`}
                    >
                      {uploadStatus === "uploading" && (
                        <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                      )}
                      {uploadStatus === "success" && (
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      )}
                      {uploadStatus === "error" && (
                        <AlertCircle className="w-10 h-10 text-red-600" />
                      )}
                      {uploadStatus === "idle" && (
                        <FolderUp
                          className={`w-10 h-10 ${
                            dragActive ? "text-emerald-600" : "text-slate-600"
                          }`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Status Messages */}
                  <div className="text-center">
                    {uploadStatus === "uploading" && (
                      <>
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                          Uploading Files...
                        </h3>
                        <p className="text-blue-600">
                          Please wait while we process your files
                        </p>
                      </>
                    )}

                    {uploadStatus === "success" && (
                      <>
                        <h3 className="text-xl font-semibold text-green-700 mb-2">
                          Upload Successful!
                        </h3>
                        <p className="text-green-600">
                          All files have been uploaded successfully
                        </p>
                      </>
                    )}

                    {uploadStatus === "error" && (
                      <>
                        <h3 className="text-xl font-semibold text-red-700 mb-2">
                          Upload Failed
                        </h3>
                        <p className="text-red-600">
                          {error?.message ||
                            "Something went wrong. Please try again."}
                        </p>
                      </>
                    )}

                    {uploadStatus === "idle" && (
                      <>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          {dragActive
                            ? "Release to drop files"
                            : "Drop files here or click to browse"}
                        </h3>
                        <p className="text-slate-600">
                          Support for multiple file formats including images,
                          documents, videos, and archives
                        </p>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {uploadStatus === "idle" && (
                    <button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                      disabled={isPending}
                    >
                      Choose Files
                    </button>
                  )}

                  {uploadStatus === "error" && (
                    <button
                      onClick={retryUpload}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Retry Upload
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Backend Response Display */}
            {data && (
              <div className="px-8 pb-6 space-y-4">
                {/* Parse and display the response */}
                {(() => {
                  try {
                    const response =
                      typeof data === "string" ? JSON.parse(data) : data;
                    const responseData = response?.data?.[0] || response;
                    const failedFiles = responseData?.failed_file_err || [];
                    const uploadedFiles = responseData?.uploaded_files || [];
                    const hasFailures = failedFiles.length > 0;
                    const hasUploads =
                      uploadedFiles && uploadedFiles.length > 0;

                    return (
                      <>
                        {/* Upload Results Summary */}
                        <div
                          className={`border rounded-xl p-6 ${
                            hasFailures && !hasUploads
                              ? "bg-red-50 border-red-200"
                              : hasFailures && hasUploads
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-green-50 border-green-200"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            {hasFailures && !hasUploads ? (
                              <AlertCircle className="w-6 h-6 text-red-600" />
                            ) : hasFailures && hasUploads ? (
                              <AlertCircle className="w-6 h-6 text-yellow-600" />
                            ) : (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                            <h4
                              className={`font-semibold ${
                                hasFailures && !hasUploads
                                  ? "text-red-800"
                                  : hasFailures && hasUploads
                                  ? "text-yellow-800"
                                  : "text-green-800"
                              }`}
                            >
                              Upload Results
                            </h4>
                          </div>

                          <div className="grid gap-4">
                            {/* Successfully Uploaded Files */}
                            {hasUploads && (
                              <div className="bg-white rounded-lg p-4 border border-green-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <h5 className="font-medium text-green-800">
                                    Successfully Uploaded (
                                    {uploadedFiles.length})
                                  </h5>
                                </div>
                                <div className="space-y-2">
                                  {uploadedFiles.map(
                                    (file: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-3 p-2 bg-green-50 rounded-lg"
                                      >
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span className="text-sm text-green-800 font-medium">
                                          {file}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Failed Files */}
                            {hasFailures && (
                              <div className="bg-white rounded-lg p-4 border border-red-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <AlertCircle className="w-5 h-5 text-red-600" />
                                  <h5 className="font-medium text-red-800">
                                    Failed Uploads ({failedFiles.length})
                                  </h5>
                                </div>
                                <div className="space-y-2">
                                  {failedFiles.map(
                                    (error: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 bg-red-50 rounded-lg"
                                      >
                                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                          <span className="text-sm text-red-800 font-medium block">
                                            {error.includes(" ")
                                              ? error.split(" ").slice(-1)[0]
                                              : error}
                                          </span>
                                          <span className="text-xs text-red-600 block mt-1">
                                            {error.includes(
                                              "daily limit reached"
                                            )
                                              ? "Daily upload limit has been reached"
                                              : error
                                                  .replace(
                                                    error
                                                      .split(" ")
                                                      .slice(-1)[0],
                                                    ""
                                                  )
                                                  .trim()}
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* No files processed */}
                            {!hasUploads && !hasFailures && (
                              <div className="bg-white rounded-lg p-4 border border-slate-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertCircle className="w-5 h-5 text-slate-500" />
                                  <h5 className="font-medium text-slate-700">
                                    No Files Processed
                                  </h5>
                                </div>
                                <p className="text-sm text-slate-600">
                                  No files were uploaded or failed during
                                  processing.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Summary Stats */}
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">
                                Total Files Processed:{" "}
                                {(uploadedFiles?.length || 0) +
                                  failedFiles.length}
                              </span>
                              <span className="text-slate-600">
                                Success Rate:{" "}
                                {(
                                  ((uploadedFiles?.length || 0) /
                                    Math.max(
                                      1,
                                      (uploadedFiles?.length || 0) +
                                        failedFiles.length
                                    )) *
                                  100
                                ).toFixed(0)}
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Raw Response (Collapsible) */}
                        <details className="bg-slate-50 border border-slate-200 rounded-xl">
                          <summary className="p-4 cursor-pointer font-medium text-slate-700 hover:bg-slate-100 rounded-xl">
                            View Raw Response
                          </summary>
                          <div className="px-4 pb-4">
                            <div className="bg-white rounded-lg p-4 border border-slate-200">
                              <pre className="text-xs text-slate-600 whitespace-pre-wrap overflow-x-auto">
                                {JSON.stringify(response, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </details>
                      </>
                    );
                  } catch (error) {
                    // Fallback for unparseable responses
                    return (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <AlertCircle className="w-6 h-6 text-slate-600" />
                          <h4 className="font-semibold text-slate-800">
                            Server Response
                            <div>
                              {error ? <div> {JSON.stringify(error)}</div> : ""}{" "}
                            </div>
                          </h4>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <pre className="text-sm text-slate-700 whitespace-pre-wrap overflow-x-auto">
                            {typeof data === "string"
                              ? data
                              : JSON.stringify(data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            )}

            {/* File List */}
            {files.length > 0 && (
              <div className="border-t border-slate-200 bg-slate-50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <File className="w-5 h-5" />
                    Selected Files ({files.length})
                  </h4>
                  <button
                    onClick={clearAllFiles}
                    className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm"
                    disabled={isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>

                <div className="grid gap-3 max-h-80 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">{getFileIcon(file)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-slate-500">
                              {formatFileSize(file.size)}
                            </span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                              {file.type || "Unknown type"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        disabled={isPending}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload Button */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    Total size:{" "}
                    {formatFileSize(
                      files.reduce((acc, file) => acc + file.size, 0)
                    )}
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={isPending || uploadStatus === "success"}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                      uploadStatus === "success"
                        ? "bg-green-600 text-white cursor-default"
                        : isPending
                        ? "bg-blue-600 text-white cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 shadow-lg"
                    }`}
                  >
                    {isPending ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : uploadStatus === "success" ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Uploaded!</span>
                      </>
                    ) : (
                      <>
                        <UploadIcon className="w-5 h-5" />
                        <span>Upload Files</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-6 text-sm text-slate-500 bg-white rounded-full px-6 py-3 shadow-sm border border-slate-200">
              <span>Max file size: 10MB</span>
              <span>•</span>
              <span>Multiple formats supported</span>
              <span>•</span>
              <span>Secure encrypted upload</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;
