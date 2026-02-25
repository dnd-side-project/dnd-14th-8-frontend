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
        "flex w-full flex-col gap-0.5 border-k-100 border-b px-5 py-4 text-left",
        "bg-k-5 hover:bg-k-10 active:bg-k-50",
        "enabled:cursor-pointer disabled:cursor-default",
        "transition-colors",
        className,
      )}
      {...props}
    >
      <p className="truncate text-b1 text-k-750">
        {renderHighlighted(text, highlight)}
      </p>
      <p className="truncate text-b5 text-k-500">{description}</p>
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
      <span key={i} className="text-primary-main">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
