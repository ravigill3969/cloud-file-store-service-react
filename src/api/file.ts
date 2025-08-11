import { useMutation, useQuery } from "@tanstack/react-query";
import type { APIError } from "./APITypesUser";
import type {
  GetDeletedImagesRes,
  ImageApiResponse,
  UploadFileResponse,
} from "./APITypesFile";
import { base_url } from "./API";
import toast from "react-hot-toast";

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
  const uploadFileWithUserID = async (
    images: File[]
  ): Promise<UploadFileResponse> => {
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

export function useDeleteImage() {
  const deleteImage = async (
    id: string
  ): Promise<{ status: "success"; data: [string] }> => {
    const response = await fetch(`${base_url}/api/file/delete?iid=${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      const err: APIError = {
        message: result.message,
        status: result.status,
      };
      throw err;
    }

    return result;
  };
  const mutate = useMutation({
    mutationKey: ["deleteImage"],
    mutationFn: deleteImage,
    onSuccess(res) {
      toast.success(res.data[0]);
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  return mutate;
}

export function useGetDeletedImages() {
  const getDeletedImages = async (): Promise<GetDeletedImagesRes> => {
    const res = await fetch(`${base_url}/api/file/deleted-images`, {
      credentials: "include",
      method: "GET",
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
    queryKey: ["getDeletedImages"],
    queryFn: getDeletedImages,
  });
  return query;
}

export function useRecoverDeletedImage() {
  const recoverImaage = async (id: string) => {
    const res = await fetch(`${base_url}/api/file/recover?id=${id}`, {
      method: "PATCH",
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

    return res;
  };

  const mutate = useMutation({
    mutationFn: recoverImaage,
    mutationKey: ["recoverImaage"],
  });

  return mutate;
}

export function useDeleteDeletedImagesPermanently() {
  const deleteDeletedImagesPermanently = async (id: string) => {
    const res = await fetch(
      `${base_url}/api/file/delete-permanently?id=${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const response = await res.json();

    if (!res.ok) {
      if (!res.ok) {
        const err: APIError = {
          message: response.message,
          status: response.status,
        };
        throw err;
      }
    }
    return res;
  };

  const mutate = useMutation({
    mutationFn: deleteDeletedImagesPermanently,
    mutationKey: ["deleteDeletedImagesPermanently"],
  });
  return mutate;
}
type EditImageParams = {
  width: string;
  height: string;
  iid: string;
};

export function useEditImage() {
  const editImage = async ({
    width,
    height,
    iid,
  }: EditImageParams): Promise<{ url: string }> => {
    const res = await fetch(
      `${base_url}/api/file/edit/${iid}/?width=${width}&height=${height}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const response = await res.json();

    if (!res.ok) {
      const err: APIError = {
        message: response.message,
        status: response.status,
      };
      throw err;
    }

    return res;
  };

  const m = useMutation({
    mutationFn: editImage,
    mutationKey: ["editImage"],
  });

  return m;
}
