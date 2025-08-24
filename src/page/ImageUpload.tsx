import {
  useState,
  useCallback,
  type JSX,
  type DragEvent,
  type ChangeEvent,
  useEffect,
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
  FolderOpen,
} from "lucide-react";
import { useUploadFiles } from "@/api/file";
import type { UploadFileResponse } from "@/api/APITypesFile";

function ImageUpload() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [res, setRes] = useState<UploadFileResponse | null>();

  const getFileIcon = (file: File): JSX.Element => {
    const type = file.type;
    const iconClasses = "w-5 h-5";

    if (type.startsWith("image/")) return <Image className={iconClasses} />;
    if (type.startsWith("video/")) return <Video className={iconClasses} />;
    if (type.startsWith("audio/")) return <Music className={iconClasses} />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className={iconClasses} />;
    if (type.includes("zip") || type.includes("archive"))
      return <Archive className={iconClasses} />;
    return <File className={iconClasses} />;
  };

  const getFileTypeColor = (file: File): string => {
    const type = file.type;
    if (type.startsWith("image/")) return "text-blue-600 bg-blue-50";
    if (type.startsWith("video/")) return "text-purple-600 bg-purple-50";
    if (type.startsWith("audio/")) return "text-green-600 bg-green-50";
    if (type.includes("pdf") || type.includes("document"))
      return "text-red-600 bg-red-50";
    if (type.includes("zip") || type.includes("archive"))
      return "text-orange-600 bg-orange-50";
    return "text-slate-600 bg-slate-50";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTotalSize = (): string => {
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    return formatFileSize(totalBytes);
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
    }
  }, []);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const { mutate, isSuccess, data } = useUploadFiles();

  useEffect(() => {
    if (isSuccess) {
      setUploadComplete(true);
      setRes(data);
      setFiles([]);
      setUploadComplete(false);
    }
  }, [isSuccess, data]);

  const handleUpload = () => {
    mutate(files);
  };
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 py-8 px-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <Image className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Upload Your Images
            </h1>
            <p className="text-slate-600 text-lg mb-4">
              Drag and drop images or click to browse your computer
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
              <span className="text-amber-800 font-medium text-sm">
                Daily upload limit: 5MB
              </span>
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
            <div className="p-8">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/50"
                }`}
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
                  accept="image/jpeg,image/png,image/gif"
                />

                <div className="flex flex-col items-center space-y-6">
                  <div
                    className={`rounded-2xl p-6 transition-all duration-300 ${
                      dragActive
                        ? "bg-blue-100 scale-110"
                        : "bg-slate-100 group-hover:bg-slate-200"
                    }`}
                  >
                    <UploadIcon
                      className={`w-12 h-12 transition-all duration-300 ${
                        dragActive ? "text-blue-600" : "text-slate-600"
                      }`}
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {dragActive
                        ? "Drop your images here"
                        : "Choose images or drag them here"}
                    </h3>
                    <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                      Support for single or bulk upload. Only upload images you
                      have permission to share.
                    </p>
                  </div>

                  <button
                    disabled={uploadComplete}
                    className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      uploadComplete
                        ? "bg-blue-400 cursor-not-allowed opacity-70 text-white"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    }`}
                  >
                    {uploadComplete ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5" />
                        Browse Images
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">
                        Selected Images
                      </h4>
                      <p className="text-slate-600 text-sm">
                        {files.length} image{files.length !== 1 ? "s" : ""} •
                        Total size: {getTotalSize()}
                      </p>
                    </div>
                    <button
                      onClick={clearAllFiles}
                      className="text-slate-500 hover:text-red-600 transition-colors text-sm font-medium"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {files.map((file, index) => {
                      const colorClasses = getFileTypeColor(file);
                      return (
                        <div
                          key={index}
                          className="group flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100/50 rounded-xl border border-slate-200/50 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${colorClasses}`}>
                              {getFileIcon(file)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 truncate mb-1">
                                {file.name}
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-slate-500">
                                <span>{formatFileSize(file.size)}</span>
                                <span>•</span>
                                <span className="capitalize">
                                  {file.type.replace("image/", "") || "Unknown"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => removeFile(index)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleUpload}
                      disabled={uploadComplete}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-3"
                    >
                      {uploadComplete ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Upload Complete!</span>
                        </>
                      ) : (
                        <>
                          <UploadIcon className="w-5 h-5" />
                          <span>
                            Upload {files.length} Image
                            {files.length !== 1 ? "s" : ""}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Results */}
          {res && (
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="p-8 space-y-6">
                {/* Uploaded Files */}
                <div className="bg-green-50/50 rounded-2xl p-6 border border-green-200/50">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-green-900">
                      Successfully Uploaded
                    </h3>
                  </div>
                  {res.uploaded_files?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {res.uploaded_files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center p-3 bg-white/70 rounded-lg border border-green-200/50"
                        >
                          <div className="p-2 bg-green-100 rounded-lg mr-3">
                            <Image className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-green-800 truncate">
                            {file}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-green-700 text-sm">No files uploaded</p>
                  )}
                </div>

                {/* Failed Files */}
                {res.failed_file_err?.length > 0 && (
                  <div className="bg-red-50/50 rounded-2xl p-6 border border-red-200/50">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-red-900">
                        Upload Errors
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {res.failed_file_err.map((err, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white/70 rounded-lg border border-red-200/50"
                        >
                          <span className="text-sm text-red-800">{err}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center px-6 py-3 bg-slate-100/50 rounded-2xl border border-slate-200/50">
              <div className="text-slate-600 text-sm">
                <span className="font-medium">Maximum file size:</span> 10MB •
                <span className="font-medium ml-1">Supported formats:</span>{" "}
                JPEG, PNG, GIF
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
