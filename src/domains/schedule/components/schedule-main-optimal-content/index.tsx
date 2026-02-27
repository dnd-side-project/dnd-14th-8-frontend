import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { CardRecommended } from "@/domains/schedule/components/card-recommended";
import { ScheduleMainOptimalPlaceholder } from "@/domains/schedule/components/schedule-main-optimal-content/placeholder";
import { splitResults } from "@/domains/schedule/components/schedule-main-optimal-content/split-results";
import { useGetMeetingScheduleVoteResults } from "@/domains/schedule/hooks/use-get-meeting-schedule-vote-results";
import { ButtonBottomWithIcon } from "@/shared/components/button-bottom-with-icon";
import { ChevronDownIcon, ChevronUpIcon } from "@/shared/components/icons";
import { PlaceholderContent } from "@/shared/components/placeholder-content";
import { cn } from "@/shared/utils/cn";

const convertToKST = (time: string) => {
  if (!time) return "";
  // 시간 형식이 "HH:mm"일 경우를 가정
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours + 9); // 9시간 추가
  date.setMinutes(minutes);

  return date.toTimeString().slice(0, 5); // 다시 "HH:mm" 형식으로 반환
};

export function ScheduleMainOptimalContent() {
  const { meetingId } = useParams() as { meetingId: string };
  const { data, isPending } = useGetMeetingScheduleVoteResults({ meetingId });

  const [isExpanded, setIsExpanded] = useState(false);
  const results = data?.scheduleVoteResult ?? [];
  const [visible, hidden] = useMemo(() => splitResults(results), [results]);

  if (isPending) {
    return (
      <PlaceholderContent
        title="최적 일정을 불러오는 중이에요."
        description="잠시만 기다려주세요."
      />
    );
  }

  if (data?.scheduleVoteResult.length === 0) {
    return <ScheduleMainOptimalPlaceholder meetingId={meetingId} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-2 text-b3 text-k-800">총 {results.length}개</div>
      {visible.map((recommendation, index) => (
        <CardRecommended
          key={`${recommendation.scheduleDate}-${recommendation.startTime}-${recommendation.endTime}`}
          index={index + 1}
          scheduleDate={recommendation.scheduleDate}
          scheduleDayOfWeek={recommendation.scheduleDayOfWeek}
          startTime={convertToKST(recommendation.startTime)}
          endTime={convertToKST(recommendation.endTime)}
          voteCount={recommendation.voteCount}
          participantCount={data?.participantCount ?? 0}
          availableParticipantNames={recommendation.availableParticipantNames}
          unavailableParticipantNames={
            recommendation.unavailableParticipantNames
          }
        />
      ))}

      {hidden.length > 0 && (
        <>
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
              isExpanded && "grid-rows-[1fr] opacity-100",
              !isExpanded && "pointer-events-none grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="mt-2 flex flex-col gap-2">
                {hidden.map((recommendation, index) => (
                  <CardRecommended
                    key={`${recommendation.scheduleDate}-${recommendation.startTime}-${recommendation.endTime}`}
                    index={visible.length + index + 1}
                    scheduleDate={recommendation.scheduleDate}
                    scheduleDayOfWeek={recommendation.scheduleDayOfWeek}
                    startTime={convertToKST(recommendation.startTime)}
                    endTime={convertToKST(recommendation.endTime)}
                    voteCount={recommendation.voteCount}
                    participantCount={data?.participantCount ?? 0}
                    availableParticipantNames={
                      recommendation.availableParticipantNames
                    }
                    unavailableParticipantNames={
                      recommendation.unavailableParticipantNames
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <ButtonBottomWithIcon
            className="mt-2"
            icon={
              isExpanded ? (
                <ChevronUpIcon className="size-4 text-k-400" />
              ) : (
                <ChevronDownIcon className="size-4 text-k-400" />
              )
            }
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "더보기 접기" : "최적일정 더보기"}
          </ButtonBottomWithIcon>
        </>
      )}
    </div>
  );
}
