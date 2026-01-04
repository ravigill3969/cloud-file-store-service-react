export interface StripeCheckoutResponse {
  status: "success" | "error";
  data: {
    checkout_url: string;
  };
}
