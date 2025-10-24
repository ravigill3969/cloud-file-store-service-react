export interface ImageData {
  id: string;
  original_filename: string;
  mime_type: string;
  upload_date: string; // ISO 8601 datetime string
  width: number;
  height: number;
  cdn_url: string;
}

export interface ImageApiResponse {
  status: "success" | "error";
  data: ImageData[];
}

export type UploadFileResponse = {
  failed_file_err: string[];
  uploaded_files: string[];
};

export type GetDeletedImagesRes = {
  status: "success";
  data: string[];
};
