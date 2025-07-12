export type APIError = {
  status: "success" | "error";
  message: string;
};

export type LoginInputT = {
  email: string;
  password: string;
};

export interface ApiGETUser {
  status: "success";
  data: GETUserData[];
}

export type GETUserData = {
  uuid: string;
  username: string;
  email: string;
  public_key: string;
  account_type: "free" | "premium" | string;
  get_api_calls: number;
  edit_api_calls: number;
  post_api_calls: number;
  created_at: string;
}
