import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface ItemSearchResultProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  highlight?: string;
  text: string;
  description: string;
  onClick?: () => void;
}

export function ItemSearchResult({
  highlight,
  text,
  description,
  onClick,
  className,
  ...props
}: ItemSearchResultProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-0.5 border-stroke-neutral-subtle border-b px-5 py-4 text-left",
        "bg-bg-neutral-default hover:bg-fill-neutral-subtlest active:bg-fill-neutral-subtler",
        "enabled:cursor-pointer disabled:cursor-default",
        "transition-colors",
        className,
      )}
      {...props}
    >
      <p className="textStyle_body1 truncate text-fg-neutral-default">
        {renderHighlighted(text, highlight)}
      </p>
      <p className="textStyle_body5 truncate text-fg-neutral-subtle">
        {description}
      </p>
    </button>
  );
}

function renderHighlighted(text: string, highlight?: string): ReactNode {
  if (!highlight) {
    return text;
  }

  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: Use index as key for highlighting
      <span key={i} className="text-fg-brand-default">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
