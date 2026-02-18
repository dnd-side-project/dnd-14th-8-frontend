import axios, { type AxiosInstance } from "axios";

export type ApiResponse<T> = {
  code: string;
  message: string;
} & (T extends void ? { data?: undefined } : { data: T });

interface ApiErrorResponse {
  code?: string;
  message?: string;
}

export function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 5000,
  });

  instance.interceptors.response.use(undefined, (error) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const code = error.response?.data?.code;
      const message = error.response?.data?.message;

      if (typeof code === "string" && typeof message === "string") {
        console.error(`[API ERROR ${code}]: ${message}`);
      }
    }

    return Promise.reject(error);
  });

  return instance;
}

export const api = createAxiosInstance();
