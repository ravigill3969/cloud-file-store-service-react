import type {
  APIError,
  ApiGETUser,
  LoginInputT,
  SecretKeyAPIRes,
} from "@/api/APITypesUser";
import { useUserContext } from "@/context/userContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

import { base_url } from "./API";

type RegisterInputT = {
  username: string;
  email: string;
  password: string;
};

export const useRegister = () => {
  const invalidateQuery = useQueryClient();
  const navigate = useNavigate();
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
      invalidateQuery.invalidateQueries({ queryKey: ["getUserInfo"] });
      navigate("/");
    },
  });

  return mutation;
};

export const useLogin = () => {
  const invalidateQuery = useQueryClient();
  const navigate = useNavigate();
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
      invalidateQuery.invalidateQueries({ queryKey: ["getUserInfo"] });
      toast.success("success!");
      navigate("/");
    },
  });

  return mutation;
};

export const useGetUserInfo = () => {
  const navigate = useNavigate();
  const getUserInfo = async (): Promise<ApiGETUser> => {
    const response = await fetch(`${base_url}/api/users/get-user`, {
      method: "GET",
      credentials: "include",
    });

    const res = await response.json();

    if (res.statusCode === 429) {
      navigate("/rate-limit");
      toast.error("Rate limit, wait for 1 minute.");
      throw new Error("Rate Limit error");
    }

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
    retry: false,
  });

  return query;
};

export const useGetSecretKey = () => {
  const getSecretKey = async ({
    password,
  }: {
    password: string;
  }): Promise<SecretKeyAPIRes> => {
    const response = await fetch(`${base_url}/api/users/get-secret-key`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    console.log(res);

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
    mutationFn: getSecretKey,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("success!");
    },
  });
  return mutation;
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setIsLoggedIn, setUserData } = useUserContext();
  const navigate = useNavigate();
  const logout = async (): Promise<{ status: "success"; message: string }> => {
    const response = await fetch(`${base_url}/api/users/logout`, {
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

  const mutation = useMutation({
    mutationFn: logout,
    mutationKey: ["logout"],
    onSuccess(res) {
      console.log(res);
      queryClient.clear();
      setUserData(undefined);
      setIsLoggedIn(false);
      toast.success(res.status);
      navigate("/login");
    },
    onError(res) {
      toast.error(res.message);
    },
  });

  return mutation;
};

export async function refreshToken() {
  const response = await fetch(`${base_url}/api/users/refresh-token`, {
    method: "GET",
    credentials: "include",
  });

  const res = await response.json();

  if (res.statusCode === 429) {
    window.location.href = "/rate-limit";
    toast.error("Rate limit, wait for 1 minute.");
    throw new Error("Rate Limit error");
  }

  if (!response.ok) {
    const err: APIError = {
      message: res.message,
      status: res.status,
    };
    throw err;
  }

  return res;
}

export const useUpdatePassword = () => {
  const updatePassword = async (data: {
    password: string;
    new_password: string;
    confirm_new_password: string;
  }): Promise<{ status: "success"; data: [string] }> => {
    const response = await fetch(`${base_url}/api/users/update-password`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
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

  const mutate = useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: updatePassword,
    onSuccess(res) {
      toast.success(res.data[0]);
    },
    onError(err) {
      toast.error(err.message);
    },
  });
  return mutate;
};
