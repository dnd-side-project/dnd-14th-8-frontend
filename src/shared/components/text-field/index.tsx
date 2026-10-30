import { Icon, IconButton } from "@moyeorak/design-system";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type ComponentType,
  type InputHTMLAttributes,
  type SVGProps,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/shared/utils/cn";

const textFieldVariants = cva(
  "flex w-full items-center rounded-xl border transition-colors",
  {
    variants: {
      variant: {
        gray: "bg-fill-neutral-subtler",
        outlined: "bg-fill-neutral-faintest",
      },
      status: {
        default:
          "hover:border-stroke-brand-subtle active:border-stroke-brand-default",
        error: "border-stroke-negative-default",
        focused: "border-stroke-brand-default bg-fill-neutral-faintest",
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
        className: "border-stroke-neutral-subtle",
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
  hidePlaceholderOnFocus?: boolean;
}

export function TextField({
  label,
  helperText,
  maxLength,
  clearable = true,
  onClear,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  hidePlaceholderOnFocus = false,
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
        <label
          htmlFor={inputId}
          className="textStyle_body3 text-fg-neutral-stronger"
        >
          {label}
        </label>
      )}

      <div
        className={cn(textFieldVariants({ status: computedStatus, variant }))}
      >
        {LeftIcon && (
          <div className="ml-3 flex items-center justify-center">
            <LeftIcon
              aria-hidden
              className="size-6 shrink-0 text-fg-neutral-subtle"
            />
          </div>
        )}

        <input
          {...props}
          ref={inputRef}
          id={inputId}
          autoComplete="off"
          className={cn(
            "textStyle_body2 w-full bg-transparent px-4 py-4 text-fg-neutral-stronger caret-fg-brand-default outline-none",
            "transition-all placeholder:text-fg-neutral-subtler",
            hidePlaceholderOnFocus && "focus:placeholder:text-transparent",
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
              aria-label="입력 지우기"
              size="md"
              variant="clear"
              onClick={handleClear}
              type="button"
            >
              <Icon type="x_circle" size="md" />
            </IconButton>
          </div>
        )}

        {RightIcon && !showDelete && (
          <div className="mr-3 flex items-center justify-center">
            <RightIcon
              aria-hidden
              className="size-6 shrink-0 text-fg-neutral-subtle"
            />
          </div>
        )}
      </div>

      {(helperText || maxLength) && (
        <div className="textStyle_caption3 flex justify-between px-1">
          <span
            className={cn(
              isFocused && computedStatus !== "error"
                ? "opacity-0"
                : "opacity-100 transition-opacity duration-200",
              computedStatus === "error"
                ? "text-fg-negative-default"
                : "text-fg-neutral-subtler",
            )}
          >
            {helperText}
          </span>
          {maxLength && (
            <div className="flex">
              <span
                className={cn(
                  status === "error" || currentLength > maxLength
                    ? "text-fg-negative-default"
                    : isFocused
                      ? "text-fg-brand-default"
                      : "text-fg-neutral-subtler",
                )}
              >
                {currentLength}
              </span>
              <span className="text-fg-neutral-subtler">/{maxLength}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
