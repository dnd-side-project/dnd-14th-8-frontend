import { Badge, Button } from "@moyeorak/design-system";
import type { HTMLAttributes } from "react";
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
        <Badge size="md" variant="neutral-weak" className="shrink-0">
          {name}
        </Badge>
        <span className="textStyle_title3 truncate text-fg-neutral-stronger">
          {location}
        </span>
      </div>

      <p className="textStyle_body5 truncate text-fg-neutral-subtle">
        {address}
      </p>

      <div className="flex items-center justify-end gap-1">
        <Button
          type="button"
          size="sm"
          variant="ghost-brand"
          onClick={onEdit}
          disabled={!onEdit}
        >
          수정
        </Button>
        <div className="h-3 w-px self-center bg-stroke-neutral-subtle" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onDelete}
          disabled={!onDelete}
        >
          삭제
        </Button>
      </div>
    </div>
  );
}
