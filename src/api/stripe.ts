import { useMutation } from "@tanstack/react-query";
import type { APIError } from "./APITypesUser";
import type { StripeCheckoutResponse } from "./APITypesStripe";
import { base_url } from "./API";
import toast from "react-hot-toast";

export function useCreateStripeSession() {
  const createSession = async (): Promise<StripeCheckoutResponse> => {
    const response = await fetch(`${base_url}/api/stripe/create-session`, {
      method: "POST",
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

  const mutate = useMutation({
    mutationKey: ["createSession"],
    mutationFn: createSession,
    onSuccess(res) {
      window.location.href = res.data.checkout_url;
    },
  });

  return mutate;
}

export function useVerifySession() {
  const createSession = async (
    sessionId: string,
  ): Promise<{ status: string }> => {
    const response = await fetch(`${base_url}/api/stripe/verify-session`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
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
      toast.success(res.status);
    },
  });

  return mutate;
}

export function useCancelSubscription() {
  const createSession = async (): Promise<{ status: string }> => {
    const response = await fetch(`${base_url}/api/stripe/cancel-subscription`, {
      method: "POST",
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

  const mutate = useMutation({
    mutationKey: ["createSession"],
    mutationFn: createSession,
    onSuccess(res) {
      toast.success(res.status);
    },
  });

  return mutate;
}
