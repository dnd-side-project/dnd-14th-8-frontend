import axios from "axios";

interface ApiErrorShape<T = unknown> {
  code?: string;
  message?: string;
  data?: T;
}

export function getApiErrorShape<T = unknown>(
  error: unknown,
): ApiErrorShape<T> | null {
  if (!axios.isAxiosError(error)) return null;

  const raw = error.response?.data;
  if (!raw || typeof raw !== "object") return null;

  const candidate = raw as {
    code?: unknown;
    message?: unknown;
    data?: unknown;
  };

  return {
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    message:
      typeof candidate.message === "string" ? candidate.message : undefined,
    data: candidate.data as T,
  };
}
