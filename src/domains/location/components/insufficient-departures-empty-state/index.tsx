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
    <div className={cn(SLOT_LAYOUT, "border border-k-100 bg-k-5 text-left")}>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-p-50 text-c1 text-primary-main">
        {name.slice(0, 1)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1">
          <span className="truncate text-k-800 text-t2">{name}</span>
          {isMine && (
            <span className="shrink-0 rounded-[4px] bg-p-50 px-1.5 text-c1 text-primary-main">
              나
            </span>
          )}
        </p>
        <p className="truncate text-b5 text-k-500">{location}</p>
      </div>
      <CheckIcon className="size-5 shrink-0 text-primary-main" />
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
          ? "border border-primary-main bg-p-50 active:bg-p-100"
          : "border border-k-200 border-dashed bg-transparent active:bg-k-5",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full",
          emphasized ? "bg-primary-main text-k-5" : "bg-k-50 text-k-400",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-t2",
            emphasized ? "text-primary-main" : "text-k-700",
          )}
        >
          {label}
        </p>
        <p className="truncate text-b5 text-k-500">{hint}</p>
      </div>
    </button>
  );
}

function WaitingSlot() {
  return (
    <div
      className={cn(SLOT_LAYOUT, "border border-k-200 border-dashed text-left")}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-k-50">
        <MemberIcon className="size-5 text-k-300" />
      </span>
      <p className="truncate text-b4 text-k-400">친구를 기다리는 중</p>
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
        <p className="mt-3 text-balance break-keep text-k-700 text-t1">
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
            className="mt-4 cursor-pointer text-b3 text-k-500 underline-offset-2 hover:underline active:text-k-700"
            onClick={handleSecondaryAction}
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
