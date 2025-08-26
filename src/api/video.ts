import { useMutation, useQuery } from "@tanstack/react-query";
import { base_url } from "./API";
import type { APIError } from "./APITypesUser";
import type { VideoApiResponse } from "./APITypesVideo";

export const useUploadVideo = () => {
  const uploadVideo = async (files: File[]) => {
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

export const useGetUploadedVideosWithUserID = () => {
  const getUploadedVIdeosWithUserID = async (): Promise<VideoApiResponse> => {
    const res = await fetch(`${base_url}/api/video/get`, {
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
  ): Promise<{ message: string; status: string }> => {
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
  });

  return m;
};
