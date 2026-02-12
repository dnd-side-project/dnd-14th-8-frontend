import type { ReactNode } from "react";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import { cn } from "@/shared/utils/cn";

interface PageHeaderProps {
  title?: string;
  onBack?: () => void;
  rightElement?: ReactNode;
  rightLabel?: string;
  onRightPress?: () => void;
  className?: string;
}

export function PageHeader({
  title,
  onBack,
  rightElement,
  rightLabel,
  onRightPress,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn("flex h-14 items-center justify-between px-4", className)}
    >
      <div className="flex min-w-10 items-center">
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
      </div>
      {title && <h1 className="text-k-900 text-t1">{title}</h1>}
      <div className="flex min-w-15 items-center justify-end">
        {rightElement && (
          <button
            type="button"
            onClick={onRightPress}
            className="flex size-15 cursor-pointer items-center justify-center"
            aria-label={rightLabel}
          >
            {rightElement}
          </button>
        )}
      </div>
    </header>
  );
}
