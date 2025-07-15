import { useMutation, useQuery } from "@tanstack/react-query";
import type { APIError } from "./APITypesUser";
import type { ImageApiResponse } from "./APITypesFile";

const base_url = import.meta.env.VITE_BACKEND_URL;

export function useGetAllFilesWithUserID() {
  const getAllFilesWithUser = async (): Promise<ImageApiResponse> => {
    const response = await fetch(`${base_url}/api/file/get-all`, {
      method: "GET",
      credentials: "include",
    });

    const res = await response.json();

    if (!response.ok) {
      const err: APIError = {
        message: res.message,
        status: res.status,
      };
      throw err;
    }

    return res;
  };

  const query = useQuery({
    queryKey: ["getAllFilesWithUser"],
    queryFn: getAllFilesWithUser,
  });

  return query;
}

export function useUploadFiles() {
  const uploadFileWithUserID = async (images: File[]) => {
    const form = new FormData();

    for (const image of images) {
      form.append("file", image);
    }
    const response = await fetch(`${base_url}/api/file/upload`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    const res = await response.json();

    if (!response.ok) {
      const err: APIError = {
        message: res.message,
        status: res.status,
      };

      throw err;
    }

    return res;
  };

  const mutate = useMutation({
    mutationFn: uploadFileWithUserID,
    mutationKey: ["uploadFileWithUserID"],
  });

  return mutate;
}
