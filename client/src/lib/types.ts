export type AppUser = {
  googleId: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type ApiErrorItem = {
  message: string;
  code?: string;
};

export type ApiEnvelope<T> = {
  status: "success" | "error"; 
  data: T;
  meta?: Record<string, unknown>;
  errors?: ApiErrorItem[];
};

