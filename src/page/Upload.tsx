import React, {
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
} from "lucide-react";
import { useUploadFiles } from "@/api/file";
import type { UploadFileResponse } from "@/api/APITypesFile";

const Upload: React.FC = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

  const [res, setRes] = useState<UploadFileResponse | null>();

  const getFileIcon = (file: File): JSX.Element => {
    const type = file.type;
    if (type.startsWith("image/")) return <Image className="w-6 h-6" />;
    if (type.startsWith("video/")) return <Video className="w-6 h-6" />;
    if (type.startsWith("audio/")) return <Music className="w-6 h-6" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="w-6 h-6" />;
    if (type.includes("zip") || type.includes("archive"))
      return <Archive className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Upload Your Files
          </h1>
          <p className="text-slate-600 text-lg">
            Drag and drop files or click to browse
          </p>

          <div className="text-blue-800">
            <strong>Daily upload limit is 5mb.</strong>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
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
            />

            <div className="flex flex-col items-center space-y-4">
              <div
                className={`rounded-full p-4 ${
                  dragActive ? "bg-blue-100" : "bg-slate-100"
                }`}
              >
                <UploadIcon
                  className={`w-8 h-8 ${
                    dragActive ? "text-blue-600" : "text-slate-600"
                  }`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {dragActive
                    ? "Drop files here"
                    : "Choose files or drag them here"}
                </h3>
                <p className="text-slate-500">
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other banned files.
                </p>
              </div>

              <button
                disabled={uploadComplete}
                className={`
    px-6 py-3 rounded-lg font-medium transition-colors
    text-white
    ${
      uploadComplete
        ? "bg-blue-400 cursor-not-allowed opacity-70"
        : "bg-blue-600 hover:bg-blue-700"
    }
  `}
              >
                {uploadComplete ? (
                  <span className="flex items-center gap-2">Uploading...</span>
                ) : (
                  "Browse Files"
                )}
              </button>
            </div>
          </div>

          {res && (
            <div className="space-y-6 mt-4 bg-slate-50 p-6 rounded-lg shadow-md border border-slate-200 max-w-2xl mx-auto">
              {/* Uploaded Files */}
              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Uploaded Files
                </h3>
                {res.uploaded_files?.length ? (
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                    {res.uploaded_files.map((file, idx) => (
                      <li
                        key={idx}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {file}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    No uploaded files
                  </p>
                )}
              </section>

              {/* Failed File Errors */}
              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Failed File Errors
                </h3>
                {res.failed_file_err?.length ? (
                  <ul className="space-y-2">
                    {res.failed_file_err.map((err, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-red-700 bg-red-100 border border-red-300 rounded-md px-3 py-2"
                      >
                        {err}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">No errors</p>
                )}
              </section>
            </div>
          )}
          {/* File List */}
          {files.length > 0 && (
            <div className="mt-8 space-y-3">
              <h4 className="text-lg font-semibold text-slate-800">
                Selected Files
              </h4>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-slate-600">{getFileIcon(file)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <p className="text-sm text-slate-600">
                  {files.length} file{files.length !== 1 ? "s" : ""} selected
                </p>

                <button
                  onClick={handleUpload}
                  disabled={uploadComplete}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-medium flex items-center space-x-2"
                >
                  {uploadComplete ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Uploaded!</span>
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-4 h-4" />
                      <span>Upload Files</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>
            Maximum file size: 10MB. Supported formats:{" "}
            <strong> image/jpeg, image/png, image/gif.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
