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
      position="bottom-center"
      icons={{
        error: <ErrorIcon className="size-5 shrink-0 text-action-red" />,
        success: <CheckIcon className="size-5 shrink-0 text-action-green" />,
      }}
      gap={4}
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
          content: cn(
            "min-w-0 items-center gap-1",
            toastOptions?.classNames?.content,
          ),
          icon: cn("size-5 shrink-0", toastOptions?.classNames?.icon),
          toast: cn(
            "cn-toast inline-flex! items-center! w-fit! min-w-[min(320px,calc(100vw-40px))]! max-w-[calc(100vw-40px)]! gap-2! rounded-2xl! px-4! py-3! text-b4! text-k-5! shadow-none!",
            "fixed! left-1/2! -translate-x-1/2!",
            "mb-[90px]!",
            toastOptions?.classNames?.toast,
          ),
          title: cn(
            "min-w-0 whitespace-normal break-keep text-left text-b4 text-k-5 leading-[1.4]",
            toastOptions?.classNames?.title,
          ),
        },
      }}
      className={cn("group toaster", className)}
    />
  );
}
