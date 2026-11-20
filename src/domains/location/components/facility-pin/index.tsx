import { Icon } from "@moyeorak/design-system";
import { PinIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export type FacilityType = "book" | "meetingroom" | "restaurant" | "cafe";

export interface FacilityPinProps {
  type: FacilityType;
  className?: string;
}

const FACILITY_ICON_TYPE = {
  book: "studyroom",
  meetingroom: "meetingroom",
  restaurant: "restaurant",
  cafe: "cafe",
} as const satisfies Record<FacilityType, string>;

export function FacilityPinDefault({ type, className }: FacilityPinProps) {
  return (
    <div
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-[7px] bg-fill-neutral-faintest shadow-[0_0_4px_0_rgba(0,0,0,0.25)]",
        className,
      )}
    >
      <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-fill-brand-default">
        <Icon type={FACILITY_ICON_TYPE[type]} size="sm" variant="inverted" />
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
      <PinIcon />
      <div className="absolute inset-0 flex translate-y-[-3px] items-center justify-center">
        <Icon type={FACILITY_ICON_TYPE[type]} size="lg" variant="inverted" />
      </div>
    </div>
  );
}
