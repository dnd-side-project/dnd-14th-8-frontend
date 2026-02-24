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
        "flex flex-col gap-1 border-k-100 border-b bg-k-5 px-5 pt-4 pb-3",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Chip size="lg">{name}</Chip>
        <span className="truncate text-k-900 text-t2">{location}</span>
      </div>

      <p className="truncate text-b5 text-k-500">{address}</p>

      <div className="flex items-center justify-end gap-1">
        <ChipButton
          size="xs"
          variant="ghost"
          onClick={onEdit}
          disabled={!onEdit}
        >
          수정
        </ChipButton>
        <div className="h-3 w-px self-center bg-k-100" />
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
