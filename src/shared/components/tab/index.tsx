import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  /** 디자인 시스템 `Icon`을 `variant` 없이 넘긴다. 색은 탭 글자 색을 따른다. */
  icon?: ReactNode;
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
            {tab.icon}

            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
