import { useMutation } from "@tanstack/react-query";
import type { APIError } from "./APITypesUser";
import type { StripeCheckoutResponse } from "./APITypesStripe";
import { base_url } from "./API";

export function useCreateStripeSession() {
  const createSession = async (): Promise<StripeCheckoutResponse> => {
    const response = await fetch(`${base_url}/api/stripe/create-session`, {
      method: "POST",
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
    mutationKey: ["createSession"],
    mutationFn: createSession,
    onSuccess(res) {
      window.location.href = res.data[0];
    },
  });

  return mutate;
}
