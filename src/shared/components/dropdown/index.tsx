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
          "textStyle_body2 h-[52px] w-full cursor-pointer appearance-none rounded-lg border border-transparent bg-fill-neutral-subtler pr-12 pl-4 text-fg-neutral-stronger outline-none transition-colors invalid:text-fg-neutral-subtle [&::-ms-expand]:hidden [&>option[value='']]:text-fg-neutral-subtle [&>option]:text-fg-neutral-stronger",
          "focus:border-stroke-brand-default active:border-stroke-brand-default",
        )}
        data-slot="dropdown"
        {...props}
      />
      <ChevronDownIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-fg-neutral-subtle"
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
