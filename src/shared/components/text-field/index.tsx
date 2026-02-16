import { cva, type VariantProps } from "class-variance-authority";
import { type InputHTMLAttributes, useId, useState } from "react";
import { IconButton } from "@/shared/components/icon-button";
import { CloseIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

const textFieldVariants = cva(
  "flex w-full items-center rounded-xl border bg-k-50 transition-colors",
  {
    variants: {
      status: {
        default:
          "border-transparent hover:border-p-300 active:border-primary-main",
        error: "border-action-red",
        focused: "border-primary-main",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "status">,
    VariantProps<typeof textFieldVariants> {
  label?: string;
  helperText?: string;
  maxLength?: number;
  onClear?: () => void;
}

export function TextField({
  label,
  helperText,
  maxLength,
  onClear,
  value,
  className,
  onChange,
  status,
  id,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const currentLength = String(value ?? "").length;
  const showDelete = currentLength > 0;
  const generatedId = useId();
  const inputId = id || generatedId;

  const computedStatus = isFocused ? "focused" : status || "default";

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-b3 text-k-900">
          {label}
        </label>
      )}

      <div
        className={cn(
          textFieldVariants({
            status: computedStatus,
          }),
          className,
        )}
      >
        <input
          className={cn(
            "w-full bg-transparent px-4 py-4 text-b2 text-k-900 caret-primary-main outline-none",
            "transition-all placeholder:text-k-400 focus:placeholder:text-transparent",
          )}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showDelete && (
          <div className="pr-1">
            <IconButton
              icon={CloseIcon}
              size="xl"
              background="circle"
              backgroundSize="xs"
              iconSize="xs"
              variant="gray"
              onClick={onClear}
              type="button"
            />
          </div>
        )}
      </div>

      {(helperText || maxLength) && (
        <div className="flex justify-between px-1 text-c3">
          <span
            className={cn(
              isFocused
                ? "opacity-0"
                : "opacity-100 transition-opacity duration-200",
              status === "error" ? "text-action-red" : "text-k-400",
            )}
          >
            {helperText}
          </span>
          {maxLength && (
            <div className="flex">
              <span
                className={cn(
                  status === "error" || currentLength > maxLength
                    ? "text-action-red"
                    : isFocused
                      ? "text-primary-main"
                      : "text-k-400",
                )}
              >
                {currentLength}
              </span>
              <span className="text-k-400">/{maxLength}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
