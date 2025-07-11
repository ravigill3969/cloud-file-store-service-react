import { useMutation } from "@tanstack/react-query";
const base_url = import.meta.env.VITE_BACKEND_URL;

type RegisterInputT = {
  username: string;
  email: string;
  password: string;
};

export const useRegister = () => {
  const register = async (data: RegisterInputT) => {
    const response = await fetch(`${base_url}/api/users/register`, {
      method: "POST",   
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    console.log(res);
  };

  const mutation = useMutation({
    mutationKey: ["register"],
    mutationFn: register,
  });

  return mutation;
};
