const MIN_DEPARTURE_COUNT = 2;

export type InsufficientDepartureAction = "add" | "share";

export interface GetInsufficientDepartureContentParams {
  registeredCount: number;
  totalCount?: number;
  hasMyDeparture: boolean;
}

export interface InsufficientDepartureContent {
  title: string;
  description: string | null;
  progressText: string;
  remainingText: string;
  helperText: string | null;
  totalStatusText: string | null;
  primaryAction: InsufficientDepartureAction;
  secondaryAction: InsufficientDepartureAction | null;
}

function formatPersonCount(count: number) {
  return `${count}명`;
}

function getProgressText({
  registeredCount,
  totalCount,
}: {
  registeredCount: number;
  totalCount?: number;
}) {
  const baseTotalCount =
    totalCount && totalCount > 0 ? totalCount : MIN_DEPARTURE_COUNT;
  const denominator = Math.max(baseTotalCount, registeredCount);

  return `출발지 등록 ${registeredCount} / ${denominator}`;
}

function getRemainingText(remainingCount: number) {
  return `중간지점 추천까지 ${formatPersonCount(remainingCount)} 더 필요해요`;
}

export function getInsufficientDepartureContent({
  registeredCount,
  totalCount,
  hasMyDeparture,
}: GetInsufficientDepartureContentParams): InsufficientDepartureContent {
  const normalizedRegisteredCount = Math.max(registeredCount, 0);
  const remainingCount = Math.max(
    MIN_DEPARTURE_COUNT - normalizedRegisteredCount,
    0,
  );
  const progressText = getProgressText({
    registeredCount: normalizedRegisteredCount,
    totalCount,
  });
  const remainingText = getRemainingText(remainingCount);

  if (normalizedRegisteredCount === 0) {
    return {
      title: "출발지를 등록하면 중간지점을 찾을 수 있어요",
      description: null,
      progressText,
      remainingText,
      helperText: null,
      totalStatusText: null,
      primaryAction: "add",
      secondaryAction: "share",
    };
  }

  if (!hasMyDeparture) {
    return {
      title: "내 출발지를 추가하면 중간지점을 찾을 수 있어요",
      description: null,
      progressText,
      remainingText,
      helperText: null,
      totalStatusText: null,
      primaryAction: "add",
      secondaryAction: "share",
    };
  }

  return {
    title: "한 명만 더 등록하면 중간지점을 찾을 수 있어요",
    description: null,
    progressText,
    remainingText,
    helperText: null,
    totalStatusText: null,
    primaryAction: "share",
    secondaryAction: "add",
  };
}
