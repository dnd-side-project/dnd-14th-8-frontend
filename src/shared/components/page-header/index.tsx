import type { ReactNode } from "react";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import { cn } from "@/shared/utils/cn";

interface PageHeaderProps {
  title?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
}

function PageHeader({
  title,
  onBack,
  rightAction,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn("flex h-14 items-center justify-between px-4", className)}
    >
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex size-10 cursor-pointer items-center justify-center"
            aria-label="뒤로가기"
          >
            <ChevronLeftIcon className="size-6 text-k-900" />
          </button>
        )}
        {title && <h1 className="text-k-900 text-t1">{title}</h1>}
      </div>
      {rightAction}
    </header>
  );
}

export { PageHeader };
export type { PageHeaderProps };
