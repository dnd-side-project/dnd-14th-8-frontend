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
}

export function CardLocationMember({
  name,
  address,
  durationMinutes,
  className,
  ...props
}: CardLocationMemberProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg border border-k-100 bg-k-5 p-4 text-left",
        "enabled:cursor-pointer disabled:cursor-default",
        "transition-colors",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <p className="mb-1 truncate text-k-800 text-t2">{name}</p>
        <Chip size="md">{address}</Chip>
        {/* <span className="inline-block rounded-[4px] bg-p-50 px-2 py-0.5 text-c1 text-primary-main">
          {address}
        </span> */}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <span className="text-k-900 text-t2">
          {formatDuration(durationMinutes)}
        </span>
        <ChevronRightIcon className="size-6 shrink-0 text-k-400" />
      </div>
    </button>
  );
}
