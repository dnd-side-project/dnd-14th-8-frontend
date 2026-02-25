import {
  TextPin,
  type TextPinProps,
} from "@/domains/location/components/text-pin";
import { LogoPinIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

const ICON_SIZE_MAP = {
  sm: "size-12",
  md: "size-19",
} as const;

export interface MarkerProps extends TextPinProps {
  size?: keyof typeof ICON_SIZE_MAP;
  iconClassName?: string;
}

export function Marker({
  size = "md",
  text,
  variant,
  className,
  iconClassName,
}: MarkerProps) {
  return (
    <div className="flex w-fit flex-col items-center px-2 py-1">
      <TextPin variant={variant} text={text} className={className} />
      <LogoPinIcon className={cn(ICON_SIZE_MAP[size], iconClassName)} />
    </div>
  );
}
