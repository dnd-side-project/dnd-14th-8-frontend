import { PolygonIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface TextPinProps {
  text: string;
  variant: "blue" | "black";
  className?: string;
}

export function TextPin({ text, variant, className }: TextPinProps) {
  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <div
        className={cn(
          "flex h-[33px] min-w-[49px] items-center justify-center rounded-[30px] px-3 py-1.5 shadow-[0_0_4px_rgba(0,0,0,0.25)]",
          variant === "blue" ? "bg-primary-main" : "bg-k-800",
        )}
      >
        <span className="whitespace-nowrap text-b3 text-k-5 leading-none">
          {text}
        </span>
      </div>
      <PolygonIcon
        className={cn(
          "mt-[-2px]",
          variant === "blue" ? "text-primary-main" : "text-k-800",
        )}
      />
    </div>
  );
}
