export interface ImageData {
  id: string;
  original_filename: string;
  mime_type: string;
  upload_date: string; // ISO 8601 datetime string
  width: number;
  height: number;
}

export interface ImageApiResponse {
  status: 'success' | 'error';
  data: ImageData[];
}
