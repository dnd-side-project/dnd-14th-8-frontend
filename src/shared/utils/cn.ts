import { type ClassValue, clsx } from "clsx";
import { twMerge } from "@/shared/utils/tw-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
