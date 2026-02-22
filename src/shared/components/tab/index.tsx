import type { ComponentType, SVGProps } from "react";
import { IconButton } from "@/shared/components/icon-button";
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
      className={cn("flex border-k-400 border-b bg-k-5", className)}
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
                ? "border-primary-main text-primary-main text-t2"
                : "border-transparent text-b1 text-k-400",
            )}
          >
            {tab.icon && (
              <IconButton
                icon={tab.icon}
                size="xs"
                iconSize="md"
                background="none"
                variant="ghost"
                className={cn(
                  "pointer-events-none transition-colors",
                  isActive && "text-primary-main",
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
