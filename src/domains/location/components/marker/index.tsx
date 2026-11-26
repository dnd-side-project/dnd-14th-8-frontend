import {
  TextPin,
  type TextPinProps,
} from "@/domains/location/components/text-pin";
import { MidpointPinIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

const ICON_SIZE_MAP = {
  sm: "size-12",
  md: "size-19",
} as const;

export interface MarkerProps extends TextPinProps {
  size?: keyof typeof ICON_SIZE_MAP;
  iconClassName?: string;
  /**
   * 그릴 부분. 지도에서는 LayeredMarker가 이름표와 아이콘을 따로 쌓으려고 나눠 그린다.
   * label은 아이콘 자리를 비워 두어, 이름표가 all일 때와 같은 높이에 온다.
   */
  part?: "all" | "label" | "icon";
}

export function Marker({
  size = "md",
  text,
  variant,
  className,
  iconClassName,
  part = "all",
}: MarkerProps) {
  return (
    <div className="flex w-fit flex-col items-center px-2 py-1">
      {part !== "icon" && (
        <TextPin variant={variant} text={text} className={className} />
      )}
      <MidpointPinIcon
        className={cn(
          ICON_SIZE_MAP[size],
          part === "label" && "invisible",
          iconClassName,
        )}
      />
    </div>
  );
}
