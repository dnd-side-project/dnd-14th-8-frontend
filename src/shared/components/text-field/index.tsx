import { forwardRef, type InputHTMLAttributes } from "react";
import CloseIcon from "@/assets/icons/close.svg?react";
import { cn } from "@/shared/utils/cn";
import { useTextField } from "./use-text-field";

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  maxLength?: number;
  showCount?: boolean;
  onValueChange?: (value: string) => void;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      maxLength,
      showCount = !!maxLength,
      className,
      value,
      defaultValue,
      onValueChange,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const { id, focused, setFocused, currentValue, handleChange, handleClear } =
      useTextField({ value, defaultValue, onValueChange, onChange });

    const hasError = !!errorMessage;

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label htmlFor={id} className="text-b3 text-k-900">
            {label}
          </label>
        )}

        <div
          className={cn(
            "flex h-[52px] items-center rounded-lg border bg-k-10 px-4 transition-colors",
            hasError
              ? "border-action-red"
              : focused
                ? "border-k-600"
                : "border-transparent",
          )}
        >
          <input
            ref={ref}
            id={id}
            className="flex-1 bg-transparent text-b2 text-k-900 outline-none placeholder:text-k-400"
            maxLength={maxLength}
            value={currentValue}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
          {currentValue.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-k-400"
              aria-label="입력 지우기"
            >
              <CloseIcon className="size-4" />
            </button>
          )}
        </div>

        <div className="flex justify-between text-c3">
          <span className={hasError ? "text-action-red" : "text-k-400"}>
            {hasError ? errorMessage : helperText}
          </span>
          {showCount && (
            <span className={hasError ? "text-action-red" : "text-k-400"}>
              {currentValue.length}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

TextField.displayName = "TextField";

export { TextField };
export type { TextFieldProps };
