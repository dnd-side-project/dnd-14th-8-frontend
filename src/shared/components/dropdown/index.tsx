import type { ComponentProps } from "react";
import { ChevronDownIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface DropdownProps
  extends Omit<ComponentProps<"select">, "disabled"> {}

export function Dropdown({ className, ...props }: DropdownProps) {
  return (
    <div
      className={cn("relative w-full", className)}
      data-slot="dropdown-wrapper"
    >
      <select
        className={cn(
          "h-[52px] w-full cursor-pointer appearance-none rounded-lg border border-transparent bg-k-50 pr-12 pl-4 text-b2 text-k-900 outline-none transition-colors invalid:text-k-500 [&::-ms-expand]:hidden [&>option[value='']]:text-k-500 [&>option]:text-k-900",
          "focus:border-primary-main active:border-primary-main",
        )}
        data-slot="dropdown"
        {...props}
      />
      <ChevronDownIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-k-500"
        data-slot="dropdown-icon"
      />
    </div>
  );
}

export function DropdownOption(props: ComponentProps<"option">) {
  return <option data-slot="dropdown-option" {...props} />;
}

export function DropdownOptGroup({
  className,
  ...props
}: ComponentProps<"optgroup">) {
  return (
    <optgroup
      className={cn(className)}
      data-slot="dropdown-optgroup"
      {...props}
    />
  );
}
