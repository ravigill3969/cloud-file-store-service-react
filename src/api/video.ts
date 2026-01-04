import { useMutation, useQuery } from "@tanstack/react-query";
import { base_url } from "./API";
import type { APIError } from "./APITypesUser";
import type {
  DeleteVideoRes,
  UploadVideoFromUIResponse,
  VideoApiResponse,
} from "./APITypesVideo";
import toast from "react-hot-toast";

export const useUploadVideo = () => {
  const uploadVideo = async (
    files: File[]
  ): Promise<UploadVideoFromUIResponse> => {
    const form = new FormData();

    for (const file of files) {
      form.append("video", file, file.name);
    }

    const res = await fetch(`${base_url}/api/video/upload`, {
      method: "POST",
      credentials: "include",
      body: form,
    });

    const response = await res.json();

    if (!res.ok) {
      const err: APIError = {
        message: response.message || "Internal server error",
        status: response.status || "error",
      };

      throw err;
    }

    return response;
  };

  const mutate = useMutation({
    mutationKey: ["uploadVideo"],
    mutationFn: uploadVideo,
  });

  return mutate;
};

export const useGetUploadedVideosWithCookie = () => {
  const getUploadedVIdeosWithUserID = async (): Promise<VideoApiResponse> => {
    const res = await fetch(`${base_url}/api/video/get-all`, {
      credentials: "include",
    });

    const response = await res.json();

    if (!res.ok) {
      const err: APIError = {
        message: response.message,
        status: response.status,
      };

      throw err;
    }

    return response;
  };

  const query = useQuery({
    queryKey: ["getUploadedVIdeosWithUserID"],
    queryFn: getUploadedVIdeosWithUserID,
  });

  return query;
};

export const useDeleteVideoWithCookie = () => {
  const deleteVideoWithCookie = async (
    vid: string
  ): Promise<DeleteVideoRes> => {
    const res = await fetch(`${base_url}/api/video/delete?vid=${vid}`, {
      method: "DELETE",
      credentials: "include",
    });
    const response = await res.json();

    if (!res.ok) {
      const err: APIError = {
        message: response.message,
        status: response.status,
      };

      throw err;
    }

    return response;
  };
  const m = useMutation({
    mutationFn: deleteVideoWithCookie,
    mutationKey: ["deleteVideoWithCookie"],
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return m;
};

export const supportedVideoFormats = [
  "MP4",
  "WebM",
  "OGG",
  "MOV",
  "AVI",
  "WMV",
  "MPEG",
  "3GP",
  "3G2",
  "FLV",
  "MKV",
  "RMVB",
];

export const allowedVideoTypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
  "video/x-ms-wmv", // .wmv
  "video/mpeg", // .mpg, .mpeg
  "video/3gpp", // .3gp
  "video/3gpp2", // .3g2
  "video/x-flv", // .flv
  "video/x-matroska", // .mkv
  "application/vnd.rn-realmedia", // .rm, .rmvb
];
