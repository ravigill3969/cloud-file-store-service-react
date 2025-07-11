export type APIError = {
  status: "success" | "error";
  message: string;
};

export type LoginInputT = {
  email: string;
  password: string;
};
