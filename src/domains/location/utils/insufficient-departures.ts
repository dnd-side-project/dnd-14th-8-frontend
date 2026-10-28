const MIN_DEPARTURE_COUNT = 2;

export type InsufficientDepartureAction = "add" | "share";

export interface DepartureSummary {
  locationVoteId: number;
  participantName: string;
  departureLocation: string;
}

/**
 * 빈 상태를 문장으로 설명하는 대신 자리(슬롯)로 그린다. 채워진 자리와 남은
 * 자리를 나란히 보여주면 "몇 명 중 몇 명"을 따로 읽어줄 필요가 없다.
 */
export type DepartureSlot =
  | {
      key: string;
      kind: "filled";
      name: string;
      location: string;
      isMine: boolean;
    }
  | { key: string; kind: "add-mine" }
  | { key: string; kind: "invite" }
  | { key: string; kind: "waiting" };

export interface GetInsufficientDepartureContentParams {
  registeredCount: number;
  hasMyDeparture: boolean;
  departures?: DepartureSummary[];
  myLocationVoteId?: number | null;
}

export interface InsufficientDepartureContent {
  title: string;
  slots: DepartureSlot[];
  primaryAction: InsufficientDepartureAction;
  secondaryAction: InsufficientDepartureAction | null;
}

function getFilledSlots({
  departures,
  slotCount,
  myLocationVoteId,
}: {
  departures: DepartureSummary[];
  slotCount: number;
  myLocationVoteId?: number | null;
}): DepartureSlot[] {
  return departures.slice(0, slotCount).map((departure) => ({
    key: `departure-${departure.locationVoteId}`,
    kind: "filled",
    name: departure.participantName,
    location: departure.departureLocation,
    isMine:
      myLocationVoteId != null && departure.locationVoteId === myLocationVoteId,
  }));
}

/**
 * 빈 자리는 첫 칸에만 다음 행동을 붙인다. 모든 칸이 버튼이면 무엇부터
 * 해야 하는지가 흐려진다.
 */
function getEmptySlots({
  emptyCount,
  hasMyDeparture,
}: {
  emptyCount: number;
  hasMyDeparture: boolean;
}): DepartureSlot[] {
  return Array.from({ length: emptyCount }, (_, index) => {
    if (index > 0) return { key: `empty-${index}`, kind: "waiting" as const };

    return {
      key: `empty-${index}`,
      kind: hasMyDeparture ? ("invite" as const) : ("add-mine" as const),
    };
  });
}

function getTitle({
  registeredCount,
  hasMyDeparture,
}: {
  registeredCount: number;
  hasMyDeparture: boolean;
}) {
  if (registeredCount === 0) return "2명이 모이면 중간지점을 찾아드려요";
  if (!hasMyDeparture) return "내 출발지를 추가하면 중간지점을 찾을 수 있어요";

  return "한 명만 더 등록하면 중간지점을 찾을 수 있어요";
}

export function getInsufficientDepartureContent({
  registeredCount,
  hasMyDeparture,
  departures = [],
  myLocationVoteId,
}: GetInsufficientDepartureContentParams): InsufficientDepartureContent {
  const normalizedRegisteredCount = Math.max(registeredCount, 0);
  const slotCount = Math.max(MIN_DEPARTURE_COUNT, normalizedRegisteredCount);
  const filledSlots = getFilledSlots({
    departures,
    slotCount,
    myLocationVoteId,
  });
  const emptySlots = getEmptySlots({
    emptyCount: slotCount - filledSlots.length,
    hasMyDeparture,
  });
  const canRegisterMine = normalizedRegisteredCount > 0 && !hasMyDeparture;

  return {
    title: getTitle({
      registeredCount: normalizedRegisteredCount,
      hasMyDeparture,
    }),
    slots: [...filledSlots, ...emptySlots],
    primaryAction: hasMyDeparture && !canRegisterMine ? "share" : "add",
    secondaryAction: hasMyDeparture && !canRegisterMine ? "add" : "share",
  };
}
