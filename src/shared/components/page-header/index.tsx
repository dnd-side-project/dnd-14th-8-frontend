import { IconButton } from "@moyeorak/design-system";
import type { ReactNode } from "react";
import { ChevronLeftIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface PageHeaderProps {
  title?: string;
  onBack?: () => void;
  rightElement?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  onBack,
  rightElement,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("relative flex h-14 items-center pr-3", className)}>
      <div className="z-10 flex min-w-12 items-center">
        {onBack && (
          <IconButton
            size="md"
            variant="clear"
            type="button"
            onClick={onBack}
            className="focus-visible:outline-2 focus-visible:outline-stroke-brand-default focus-visible:outline-offset-2"
            aria-label="뒤로가기"
          >
            <ChevronLeftIcon aria-hidden className="size-6" />
          </IconButton>
        )}
      </div>

      {title && (
        <h1 className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-k-900 text-t1">
          {title}
        </h1>
      )}

      <div className="z-10 ml-auto flex min-w-10 items-center justify-end">
        {rightElement && (
          <div className="flex items-center justify-center">{rightElement}</div>
        )}
      </div>
    </header>
  );
}
