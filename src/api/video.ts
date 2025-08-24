import { useMutation } from "@tanstack/react-query";
import { base_url } from "./API";
import type { APIError } from "./APITypesUser";

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
