import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useUpdateMeeting } from "@/domains/meeting/hooks/use-update-meeting";
import {
  getMeetingSchedulesQueryKey,
  useGetMeetingSchedules,
} from "@/domains/schedule/hooks/use-get-meeting-schedules";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { Stepper } from "@/shared/components/stepper";
import { toast } from "@/shared/components/toast";
import { getGuestId } from "@/shared/utils/auth";

export function MeetingEditParticipantsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { meetingId } = useParams(); // TODO: flow로 navigate 분기하기
  const currentMeetingId = meetingId ?? "sample-meeting-id";

  const { data: meetingData, isLoading } = useGetMeetingSchedules({
    meetingId: currentMeetingId,
  });

  const [count, setCount] = useState(2);
  const initialCount = meetingData?.participantCount ?? 2;

  useEffect(() => {
    if (meetingData?.participantCount) {
      setCount(meetingData.participantCount);
    }
  }, [meetingData?.participantCount]);

  const { mutate: updateMeeting, isPending: isUpdating } = useUpdateMeeting();

  const isInvalid = count < initialCount;
  const isUnchanged = count === initialCount;
  const canSubmit = !isInvalid && !isUnchanged && !isUpdating;

  const handleSubmit = () => {
    if (!canSubmit) return;

    updateMeeting(
      {
        meetingId: currentMeetingId,
        participantCount: count,
        localStorageKey: getGuestId(),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getMeetingSchedulesQueryKey({
              meetingId: currentMeetingId,
            }),
          });
          // TODO: 수정 -> 일정일 때, 장소일 떄
          navigate(`/meetings/${currentMeetingId}/schedule`);

          toast.success("모임인원이 수정되었어요");
        },
        onError: () => {
          alert("수정에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader
          title="모임 인원 수정"
          // TODO: 수정 -> 일정일 때, 장소일 떄
          onBack={() => navigate(`/meetings/${currentMeetingId}/schedule`)}
        />

        <Stepper
          label="인원 수"
          value={count}
          onChange={(newValue) => {
            if (newValue < initialCount) {
              toast.error("현재 참여 인원보다 적게 설정할 수 없어요");
              return;
            }
            setCount(newValue);
          }}
        />

        <div className="mt-auto">
          <ButtonBottom
            variant="black"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            완료
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
