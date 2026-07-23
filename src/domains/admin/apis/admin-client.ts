import axios, { type AxiosInstance } from "axios";
import {
  clearAdminToken,
  getAdminToken,
} from "@/domains/admin/store/admin-token";

/**
 * 관리자 전용 axios 인스턴스. 모든 요청에 X-Admin-Token 헤더를 부착하고,
 * 401 응답 시 저장된 토큰을 폐기해 로그인 폼으로 되돌아가게 한다.
 */
export function createAdminAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  instance.interceptors.request.use((config) => {
    const token = getAdminToken();
    if (token) {
      config.headers.set("X-Admin-Token", token);
    }
    return config;
  });

  instance.interceptors.response.use(undefined, (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAdminToken();
    }
    return Promise.reject(error);
  });

  return instance;
}

export const adminApi = createAdminAxiosInstance();
