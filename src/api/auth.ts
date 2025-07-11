import type { APIError, ApiGETUser, LoginInputT } from "@/api/APItypes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
const base_url = import.meta.env.VITE_BACKEND_URL;

type RegisterInputT = {
  username: string;
  email: string;
  password: string;
};

export const useRegister = () => {
  const register = async (
    data: RegisterInputT
  ): Promise<{ status: string }> => {
    const response = await fetch(`${base_url}/api/users/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

  const mutation = useMutation({
    mutationKey: ["register"],
    mutationFn: register,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("success!");
    },
  });

  return mutation;
};

export const useLogin = () => {
  const login = async (data: LoginInputT): Promise<{ status: string }> => {
    const response = await fetch(`${base_url}/api/users/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("success!");
    },
  });

  return mutation;
};

export const useGetUserInfo = () => {
  const getUserInfo = async (): Promise<ApiGETUser> => {
    const response = await fetch(`${base_url}/api/users/get-user`, {
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
    queryKey: ["getUserInfo"],
    queryFn: getUserInfo,
  });

  return query;
};
