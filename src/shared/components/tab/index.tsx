import type { ComponentType, SVGProps } from "react";
import { cn } from "@/shared/utils/cn";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface TabItem {
  id: string;
  label: string;
  icon?: IconComponent;
}

export interface TabProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tab({ tabs, activeTabId, onTabChange, className }: TabProps) {
  return (
    <div
      className={cn(
        "flex border-stroke-neutral-strong border-b bg-bg-neutral-default",
        className,
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "-mb-[1px] flex flex-1 cursor-pointer items-center justify-center gap-[1px] border-b-2 py-3 transition-colors",
              isActive
                ? "textStyle_title3 border-stroke-brand-default text-fg-brand-default"
                : "textStyle_body1 border-transparent text-fg-neutral-subtler",
            )}
          >
            {tab.icon && (
              <tab.icon
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive
                    ? "text-fg-brand-default"
                    : "text-fg-neutral-subtler",
                )}
              />
            )}

            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
