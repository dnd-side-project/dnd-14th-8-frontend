import type { ButtonHTMLAttributes } from "react";
import { formatDuration } from "@/domains/location/utils/format";
import { Chip } from "@/shared/components/chip";
import { ChevronRightIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface CardLocationMemberProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  address: string;
  durationMinutes: number;
  unreachable?: boolean;
}

export function CardLocationMember({
  name,
  address,
  durationMinutes,
  unreachable = false,
  className,
  ...props
}: CardLocationMemberProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg border border-stroke-neutral-subtle bg-fill-neutral-faintest p-4 text-left",
        "enabled:cursor-pointer disabled:cursor-default",
        "transition-colors",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <p className="textStyle_title3 mb-1 truncate text-fg-neutral-strong">
          {name}
        </p>
        <Chip size="md">{address}</Chip>
        {/* <span className="inline-block rounded-[4px] bg-fill-brand-subtle px-2 py-0.5 textStyle_caption1 text-fg-brand-default">
          {address}
        </span> */}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <span
          className={
            unreachable
              ? "textStyle_body4 text-fg-neutral-subtler"
              : "textStyle_title3 text-fg-neutral-stronger"
          }
        >
          {unreachable ? "경로 없음" : formatDuration(durationMinutes)}
        </span>
        <ChevronRightIcon className="size-6 shrink-0 text-fg-neutral-subtler" />
      </div>
    </button>
  );
}
