const ADMIN_TOKEN_KEY = "admin-token";

/**
 * 관리자 토큰은 세션 한정(sessionStorage)으로만 보관한다. 탭 종료 시 만료된다.
 */
export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}
