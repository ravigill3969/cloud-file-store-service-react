export interface StripeCheckoutResponse {
  status: "success" | "error";
  data: string[];
}
