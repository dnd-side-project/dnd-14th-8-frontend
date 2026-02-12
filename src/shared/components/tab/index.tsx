import { cn } from "@/shared/utils/cn";

interface TabItem {
  id: string;
  label: string;
}

interface TabProps {
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
              "relative flex-1 cursor-pointer py-3 text-center transition-colors",
              isActive ? "text-primary-main text-t2" : "text-b1 text-k-400",
            )}
          >
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary-main" />
            )}
          </button>
        );
      })}
    </div>
  );
}
