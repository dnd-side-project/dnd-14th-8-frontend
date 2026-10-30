import { Badge } from "@moyeorak/design-system";
import { Empty1Character } from "@/assets/characters";
import type {
  DepartureSlot,
  InsufficientDepartureContent,
} from "@/domains/location/utils/insufficient-departures";
import {
  CheckIcon,
  MemberIcon,
  PlusIcon,
  ShareIcon,
} from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

const SLOT_LAYOUT = "flex w-full items-center gap-3 rounded-xl px-4 py-3";

function FilledSlot({
  name,
  location,
  isMine,
}: {
  name: string;
  location: string;
  isMine: boolean;
}) {
  return (
    <div
      className={cn(
        SLOT_LAYOUT,
        "border border-stroke-neutral-subtle bg-fill-neutral-faintest text-left",
      )}
    >
      <span className="textStyle_caption1 grid size-9 shrink-0 place-items-center rounded-full bg-fill-brand-subtle text-fg-brand-default">
        {name.slice(0, 1)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1">
          <span className="textStyle_title3 truncate text-fg-neutral-strong">
            {name}
          </span>
          {isMine && (
            <Badge size="sm" variant="brand-weak" className="shrink-0">
              나
            </Badge>
          )}
        </p>
        <p className="textStyle_body5 truncate text-fg-neutral-subtle">
          {location}
        </p>
      </div>
      <CheckIcon className="size-5 shrink-0 text-fg-brand-default" />
    </div>
  );
}

function EmptySlotButton({
  icon,
  label,
  hint,
  emphasized,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  emphasized: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        SLOT_LAYOUT,
        "cursor-pointer text-left transition-colors",
        emphasized
          ? "border border-stroke-brand-default bg-fill-brand-subtle active:bg-fill-brand-subtle-pressed"
          : "border border-stroke-neutral-default border-dashed bg-transparent active:bg-fill-neutral-faintest",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full",
          emphasized
            ? "bg-fill-brand-default text-fg-neutral-faintest"
            : "bg-fill-neutral-subtler text-fg-neutral-subtler",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "textStyle_title3 truncate",
            emphasized ? "text-fg-brand-default" : "text-fg-neutral-default",
          )}
        >
          {label}
        </p>
        <p className="textStyle_body5 truncate text-fg-neutral-subtle">
          {hint}
        </p>
      </div>
    </button>
  );
}

function WaitingSlot() {
  return (
    <div
      className={cn(
        SLOT_LAYOUT,
        "border border-stroke-neutral-default border-dashed text-left",
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-fill-neutral-subtler">
        <MemberIcon className="size-5 text-fg-neutral-subtlest" />
      </span>
      <p className="textStyle_body4 truncate text-fg-neutral-subtler">
        친구를 기다리는 중
      </p>
    </div>
  );
}

function Slot({
  slot,
  onAddDeparture,
  onShare,
}: {
  slot: DepartureSlot;
  onAddDeparture: () => void;
  onShare: () => void;
}) {
  if (slot.kind === "filled") {
    return (
      <FilledSlot
        name={slot.name}
        location={slot.location}
        isMine={slot.isMine}
      />
    );
  }

  if (slot.kind === "add-mine") {
    return (
      <EmptySlotButton
        icon={<PlusIcon className="size-5" />}
        label="내 출발지 등록하기"
        hint="어디서 출발하는지 알려주세요"
        emphasized
        onClick={onAddDeparture}
      />
    );
  }

  if (slot.kind === "invite") {
    return (
      <EmptySlotButton
        icon={<ShareIcon className="size-5" />}
        label="친구를 기다리는 중"
        hint="초대 링크 공유하기"
        emphasized={false}
        onClick={onShare}
      />
    );
  }

  return <WaitingSlot />;
}

export function InsufficientDeparturesEmptyState({
  content,
  onAddDeparture,
  onShare,
}: {
  content: InsufficientDepartureContent;
  onAddDeparture: () => void;
  onShare: () => void;
}) {
  const secondaryActionLabel =
    content.secondaryAction === "add"
      ? "출발지 직접 추가하기"
      : content.secondaryAction === "share"
        ? "초대 링크 공유하기"
        : null;
  const handleSecondaryAction =
    content.secondaryAction === "add"
      ? onAddDeparture
      : content.secondaryAction === "share"
        ? onShare
        : undefined;

  return (
    <div className="grid min-h-0 flex-1 place-items-center">
      <div className="flex w-full max-w-[320px] flex-col items-center text-center">
        <Empty1Character
          aria-label="출발지 부족 안내 캐릭터"
          className="h-[72px] w-auto"
        />
        <p className="textStyle_title1 mt-3 text-balance break-keep text-fg-neutral-default">
          {content.title}
        </p>
        <div className="mt-5 flex w-full flex-col gap-2">
          {content.slots.map((slot) => (
            <Slot
              key={slot.key}
              slot={slot}
              onAddDeparture={onAddDeparture}
              onShare={onShare}
            />
          ))}
        </div>
        {secondaryActionLabel && handleSecondaryAction && (
          <button
            type="button"
            className="textStyle_body3 mt-4 cursor-pointer text-fg-neutral-subtle underline-offset-2 hover:underline active:text-fg-neutral-default"
            onClick={handleSecondaryAction}
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
