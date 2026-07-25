import { Empty1Character } from "@/assets/characters";
import type { InsufficientDepartureContent } from "@/domains/location/utils/insufficient-departures";

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
      <div className="flex max-w-[320px] flex-col items-center text-center">
        <Empty1Character
          aria-label="출발지 부족 안내 캐릭터"
          className="h-[92px] w-auto"
        />
        <div className="mt-4 flex flex-col items-center gap-3">
          <p className="text-k-700 text-t1">{content.title}</p>
          {content.description && (
            <p className="text-b4 text-k-500">{content.description}</p>
          )}
          <div className="flex flex-col items-center gap-1.5">
            <p className="rounded-full bg-p-50 px-3 py-1 text-b4 text-primary-main">
              {content.progressText}
            </p>
            <p className="text-b4 text-k-500">{content.remainingText}</p>
            {content.totalStatusText && (
              <p className="text-b4 text-k-400">{content.totalStatusText}</p>
            )}
          </div>
          {content.helperText && (
            <p className="text-b4 text-k-400">{content.helperText}</p>
          )}
          {secondaryActionLabel && handleSecondaryAction && (
            <button
              type="button"
              className="mt-1 text-b3 text-primary-main underline-offset-2 enabled:active:text-p-500 enabled:hover:underline"
              onClick={handleSecondaryAction}
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
