import {
  BookIcon,
  CafeIcon,
  MeetingRoomIcon,
  PinLogoIcon,
  RestaurantIcon,
} from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export type FacilityType = "book" | "meetingroom" | "restaurant" | "cafe";

export interface FacilityPinProps {
  type: FacilityType;
  className?: string;
}

const FacilityIcon = ({
  type,
  className,
}: {
  type: FacilityType;
  className?: string;
}) => {
  const iconProps = { className: cn("text-k-5", className) };

  switch (type) {
    case "book":
      return <BookIcon {...iconProps} />;
    case "meetingroom":
      return <MeetingRoomIcon {...iconProps} />;
    case "restaurant":
      return <RestaurantIcon {...iconProps} />;
    case "cafe":
      return <CafeIcon {...iconProps} />;
  }
};

export function FacilityPinDefault({ type, className }: FacilityPinProps) {
  return (
    <div
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-[7px] bg-k-5 shadow-[0_0_4px_0_rgba(0,0,0,0.25)]",
        className,
      )}
    >
      <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary-main">
        <FacilityIcon type={type} className="size-5" />
      </div>
    </div>
  );
}

export function FacilityPinSelected({ type, className }: FacilityPinProps) {
  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center justify-center",
        className,
      )}
    >
      <PinLogoIcon />
      <div className="absolute inset-0 flex translate-y-[-3px] items-center justify-center">
        <FacilityIcon type={type} className="size-8" />
      </div>
    </div>
  );
}
