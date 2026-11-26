import { Icon } from "@moyeorak/design-system";
import { SelectedPlacePinBaseIcon } from "@/shared/components/icons";
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

/**
 * 지도를 축소했을 때 장소 핀(FacilityPinDefault) 대신 그리는 점(#277). 장소 핀을 절반으로 줄이고 아이콘을 뺀
 * 모양으로, 14px 둥근 사각형이고 흰 테두리 2px를 포함한다. 사람 출발지의 원 점(DotPin)과 구분하려고 원으로
 * 만들지 않는다. 이름은 넣지 않는다. 장소 핀도 이름이 없고, 화면 낭독기는 목록 카드에서 이름을 읽는다.
 */
export function FacilityPinDot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-3.5 rounded-sm border-2 border-fill-neutral-faintest bg-fill-brand-default shadow-[0_0_4px_0_rgba(0,0,0,0.25)]",
        className,
      )}
    />
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
      <SelectedPlacePinBaseIcon />
      <div className="absolute inset-0 flex translate-y-[-3px] items-center justify-center">
        <Icon type={FACILITY_ICON_TYPE[type]} size="lg" variant="inverted" />
      </div>
    </div>
  );
}
