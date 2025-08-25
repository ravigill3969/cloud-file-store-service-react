export interface VideoItem {
  vid: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  url: string;
}

export type ApiResponse<T> = {
  data: T[];
  status: "success" | "error";
};

export type VideoApiResponse = ApiResponse<VideoItem>;
