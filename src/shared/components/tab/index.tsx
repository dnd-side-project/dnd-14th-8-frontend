import { cn } from "@/shared/utils/cn";

export interface TabItem {
  id: string;
  label: string;
}

export interface TabProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tab({ tabs, activeTabId, onTabChange, className }: TabProps) {
  return (
    <div className={cn("flex border-k-400 border-b", className)} role="tablist">
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
              "-mb-[1px] flex-1 cursor-pointer border-b-2 py-3 text-center transition-colors",
              isActive
                ? "border-primary-main text-primary-main text-t2"
                : "border-transparent text-b1 text-k-400",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
