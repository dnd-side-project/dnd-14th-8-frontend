import { cva } from "class-variance-authority";
import {
  type ButtonHTMLAttributes,
  type ComponentType,
  type SVGProps,
  useMemo,
} from "react";
import { cn } from "@/shared/utils/cn";

const iconButtonVariants = cva(
  "group inline-flex cursor-pointer items-center justify-center transition-colors",
  {
    variants: {
      size: {
        xs: "size-5", // 20px
        sm: "size-8", // 32px
        md: "size-9", // 36px
        lg: "size-10", // 40px
        xl: "size-12", // 48px
        "2xl": "size-[54px]", // 54px
      },
      background: { none: "", circle: "", square: "" },
      variant: {
        primary: "text-k-5",
        surface: "text-k-500",
        dark: "text-white",
        gray: "text-k-5",
        neutral: "text-k-500",
        subtle: "text-k-700",
        ghost: "text-k-400",
      },
    },
    compoundVariants: [
      {
        background: "none",
        variant: "primary",
        class: "enabled:active:text-p-500 enabled:hover:text-p-450",
      },
      {
        background: "none",
        variant: "surface",
        class: "enabled:active:text-k-800 enabled:hover:text-k-700",
      },
      {
        background: "none",
        variant: "dark",
        class: "enabled:active:text-k-700 enabled:hover:text-k-750",
      },
      {
        background: "none",
        variant: "neutral",
        class: "enabled:active:text-k-800 enabled:hover:text-k-700",
      },
      {
        background: "none",
        variant: "subtle",
        class: "enabled:active:text-k-900 enabled:hover:text-k-800",
      },
      {
        background: "none",
        variant: "ghost",
      },
    ],
    defaultVariants: {
      size: "lg",
      background: "none",
      variant: "neutral",
    },
  },
);

const backgroundVariants = cva(
  "flex items-center justify-center transition-colors",
  {
    variants: {
      background: {
        circle: "rounded-full",
        square: "rounded-lg",
      },
      backgroundSize: {
        xs: "size-5", // 20px
        sm: "size-7", // 28px
        md: "size-8", // 32px
        lg: "size-[54px]", // 54px
      },
      variant: {
        primary:
          "bg-primary-main transition-colors group-enabled:group-active:bg-p-500 group-enabled:group-hover:bg-p-450",
        surface:
          "bg-k-5 transition-colors group-enabled:group-active:bg-k-200 group-enabled:group-hover:bg-k-100",
        dark: "bg-k-800 transition-colors group-enabled:group-active:bg-k-700 group-enabled:group-hover:bg-k-750",
        gray: "bg-k-300 transition-colors group-enabled:group-active:bg-k-500 group-enabled:group-hover:bg-k-400",
        neutral:
          "bg-k-100 transition-colors group-enabled:group-active:bg-k-300 group-enabled:group-hover:bg-k-200",
        subtle:
          "transition-colors group-enabled:group-active:bg-k-50 group-enabled:group-hover:bg-k-10",
        ghost: "bg-transparent",
      },
    },
    defaultVariants: {
      background: "square",
      backgroundSize: "md",
      variant: "primary",
    },
  },
);

const iconVariants = cva("shrink-0", {
  variants: {
    iconSize: {
      xs: "size-[15px]", // 15px
      sm: "size-4", // 16px
      md: "size-5", // 20px
      lg: "size-6", // 24px
      xl: "size-9", // 36px
    },
  },
  defaultVariants: {
    iconSize: "xs",
  },
});

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconComponent;
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  background?: "none" | "circle" | "square";
  backgroundSize?: "xs" | "sm" | "md" | "lg";
  iconSize: "xs" | "sm" | "md" | "lg" | "xl";
  variant?:
    | "primary"
    | "surface"
    | "dark"
    | "gray"
    | "neutral"
    | "subtle"
    | "ghost";
  iconClassName?: string;
}

export function IconButton({
  type = "button",
  size,
  variant,
  background = "none",
  backgroundSize = "md",
  icon: Icon,
  iconSize,
  iconClassName,
  className,
  ...props
}: IconButtonProps) {
  const buttonVariant =
    background === "none" ? variant || "neutral" : variant || "primary";

  const icon = useMemo(
    () => (
      <Icon
        aria-hidden
        className={cn(iconVariants({ iconSize }), iconClassName)}
      />
    ),
    [iconSize, iconClassName],
  );

  return (
    <button
      className={cn(
        iconButtonVariants({ size, background, variant: buttonVariant }),
        className,
      )}
      type={type}
      {...props}
    >
      {background === "none" && icon}
      {background !== "none" && (
        <div
          className={cn(
            backgroundVariants({
              background,
              backgroundSize,
              variant: buttonVariant,
            }),
          )}
        >
          {icon}
        </div>
      )}
    </button>
  );
}
