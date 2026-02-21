import { cva, type VariantProps } from "class-variance-authority";
import { type InputHTMLAttributes, useId, useRef, useState } from "react";
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
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLength = String(value ?? "").length;
  const showDelete = currentLength > 0;
  const generatedId = useId();
  const inputId = id || generatedId;

  const computedStatus =
    status === "error" ? "error" : isFocused ? "focused" : "default";

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClear?.();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
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
        )}
      >
        <input
          {...props}
          ref={inputRef}
          id={inputId}
          autoComplete="off"
          className={cn(
            "w-full bg-transparent px-4 py-4 text-b2 text-k-900 caret-primary-main outline-none",
            "transition-all placeholder:text-k-400 focus:placeholder:text-transparent",
          )}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
              onClick={handleClear}
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
