import type { CSSProperties } from "react";
import {
  Toaster as Sonner,
  toast as sonnerToast,
  type ToasterProps,
} from "sonner";
import { CheckIcon, ErrorIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export const toast = {
  success: sonnerToast.success,
  dismiss: sonnerToast.dismiss,
  error: sonnerToast.error,
};

const TOAST_BOTTOM_OFFSET = 90; // 78px (button-bottom container height) + 12px (padding)

export interface ToastProps extends ToasterProps {}

export function Toast({
  className,
  style,
  toastOptions,
  ...props
}: ToastProps) {
  return (
    <Sonner
      {...props}
      icons={{
        error: <ErrorIcon className="size-5 shrink-0 text-action-red" />,
        success: <CheckIcon className="size-5 shrink-0 text-action-green" />,
      }}
      gap={4}
      offset={{ bottom: TOAST_BOTTOM_OFFSET }}
      style={
        {
          "--border-radius": "calc(infinity * 1px)",
          "--normal-bg": "var(--color-k700)",
          "--normal-border": "transparent",
          "--normal-text": "var(--color-k5)",
          ...style,
        } as CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          closeButton: cn(
            "border-none bg-k-750 text-k-300 transition-colors hover:bg-k-800 hover:text-k-100",
            toastOptions?.classNames?.closeButton,
          ),
          content: cn("items-center gap-1", toastOptions?.classNames?.content),
          icon: cn("size-5 shrink-0", toastOptions?.classNames?.icon),
          toast: cn(
            "cn-toast inline-flex! items-center! w-fit! gap-0.5! rounded-full! px-4! py-2! text-b4! text-k-5! shadow-none! data-[x-position=center]:right-0 data-[x-position=center]:left-0 data-[x-position=center]:mx-auto",
            toastOptions?.classNames?.toast,
          ),
          title: cn("text-b4 text-k-5", toastOptions?.classNames?.title),
        },
      }}
      className={cn("group toaster", className)}
    />
  );
}
