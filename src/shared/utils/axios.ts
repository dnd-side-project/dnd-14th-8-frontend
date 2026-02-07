import axios, { type AxiosInstance, type AxiosResponse } from "axios";

export interface CommonResponse<T> {
  code: string;
  message: string;
  data: T;
}

export function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 5000,
  });

  instance.interceptors.response.use(
    <T>(response: AxiosResponse<CommonResponse<T>>): T => {
      const { data } = response.data;

      return data;
    },
    (error) => {
      if (error.response) {
        const { code, message } = error.response.data;
        console.error(`[API ERROR ${code}]: ${message}`);
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export const api = createAxiosInstance();
