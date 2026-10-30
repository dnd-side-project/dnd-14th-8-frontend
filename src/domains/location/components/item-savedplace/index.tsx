import type { HTMLAttributes } from "react";
import { Chip } from "@/shared/components/chip";
import { ChipButton } from "@/shared/components/chip-button";
import { cn } from "@/shared/utils/cn";

export interface ItemSavedplaceProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  location: string;
  address: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ItemSavedplace({
  name,
  location,
  address,
  onEdit,
  onDelete,
  className,
  ...props
}: ItemSavedplaceProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-stroke-neutral-subtle border-b bg-bg-neutral-default px-5 pt-4 pb-3",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Chip size="lg">{name}</Chip>
        <span className="textStyle_title3 truncate text-fg-neutral-stronger">
          {location}
        </span>
      </div>

      <p className="textStyle_body5 truncate text-fg-neutral-subtle">
        {address}
      </p>

      <div className="flex items-center justify-end gap-1">
        <ChipButton
          size="xs"
          variant="ghost"
          onClick={onEdit}
          disabled={!onEdit}
        >
          수정
        </ChipButton>
        <div className="h-3 w-px self-center bg-stroke-neutral-subtle" />
        <ChipButton
          size="xs"
          variant="locationDelete"
          onClick={onDelete}
          disabled={!onDelete}
        >
          삭제
        </ChipButton>
      </div>
    </div>
  );
}
