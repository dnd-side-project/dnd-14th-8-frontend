import { cn } from "@/shared/utils/cn";

interface TabProps {
  items: string[];
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

function Tab({ items, activeIndex, onChange, className }: TabProps) {
  return (
    <div className={cn("flex border-k-200 border-b", className)} role="tablist">
      {items.map((label, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(index)}
            className={cn(
              "relative flex-1 cursor-pointer py-3 text-center text-b3 transition-colors",
              isActive ? "text-k-900" : "text-k-400",
            )}
          >
            {label}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-[3px] bg-primary-main" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { Tab };
export type { TabProps };
