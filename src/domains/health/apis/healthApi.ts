import { api } from "@/shared/utils/axios";

export function getHealthCheck() {
  return api.get<string>("/health");
}
