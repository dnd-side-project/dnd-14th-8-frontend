import { cva, type VariantProps } from "class-variance-authority";
import {
  type ComponentType,
  type InputHTMLAttributes,
  type SVGProps,
  useId,
  useRef,
  useState,
} from "react";
import { IconButton } from "@/shared/components/icon-button";
import { CloseIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

const textFieldVariants = cva(
  "flex w-full items-center rounded-xl border transition-colors",
  {
    variants: {
      variant: {
        gray: "bg-k-50",
        outlined: "bg-k-5",
      },
      status: {
        default: "hover:border-p-300 active:border-primary-main",
        error: "border-action-red",
        focused: "border-primary-main",
      },
    },
    compoundVariants: [
      {
        variant: "gray",
        status: "default",
        className: "border-transparent",
      },
      {
        variant: "outlined",
        status: "default",
        className: "border-k-100",
      },
    ],
    defaultVariants: {
      variant: "gray",
      status: "default",
    },
  },
);

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "status">,
    VariantProps<typeof textFieldVariants> {
  label?: string;
  helperText?: string;
  maxLength?: number;
  clearable?: boolean;
  onClear?: () => void;
  leftIcon?: IconComponent;
  rightIcon?: IconComponent;
}

export function TextField({
  label,
  helperText,
  maxLength,
  clearable = true,
  onClear,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  value,
  className,
  onChange,
  status,
  variant,
  id,
  onFocus,
  onBlur,
  readOnly,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLength = String(value ?? "").length;
  const showDelete = clearable && !readOnly && !!onClear && currentLength > 0;
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
        className={cn(textFieldVariants({ status: computedStatus, variant }))}
      >
        {LeftIcon && (
          <div className="ml-3 flex items-center justify-center">
            <LeftIcon aria-hidden className="size-6 shrink-0 text-k-500" />
          </div>
        )}

        <input
          {...props}
          ref={inputRef}
          id={inputId}
          autoComplete="off"
          className={cn(
            "w-full bg-transparent px-4 py-4 text-b2 text-k-900 caret-primary-main outline-none",
            "transition-all placeholder:text-k-400 focus:placeholder:text-transparent",
            !!LeftIcon && "pl-2",
          )}
          value={value}
          readOnly={readOnly}
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

        {RightIcon && !showDelete && (
          <div className="mr-3 flex items-center justify-center">
            <RightIcon aria-hidden className="size-6 shrink-0 text-k-500" />
          </div>
        )}
      </div>

      {(helperText || maxLength) && (
        <div className="flex justify-between px-1 text-c3">
          <span
            className={cn(
              isFocused && computedStatus !== "error"
                ? "opacity-0"
                : "opacity-100 transition-opacity duration-200",
              computedStatus === "error" ? "text-action-red" : "text-k-400",
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
