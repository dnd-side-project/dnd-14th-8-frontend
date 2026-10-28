import { useCallback, useState } from "react";
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "@/domains/admin/store/admin-token";

export interface AdminAuth {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

/**
 * sessionStorage의 관리자 토큰을 React 상태와 동기화한다.
 * 401 응답 시 admin-client 인터셉터가 sessionStorage를 비우므로, 화면에서는 logout()으로 상태를 맞춘다.
 */
export function useAdminAuth(): AdminAuth {
  const [token, setToken] = useState<string | null>(() => getAdminToken());

  const login = useCallback((next: string) => {
    setAdminToken(next);
    setToken(next);
  }, []);

  const logout = useCallback(() => {
    clearAdminToken();
    setToken(null);
  }, []);

  return { token, isAuthenticated: Boolean(token), login, logout };
}
