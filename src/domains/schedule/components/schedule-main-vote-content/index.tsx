import { useMemo } from "react";
import { useParams } from "react-router";
import type { ScheduleParticipant } from "@/domains/meeting/types/meeting-api-types";
import { ScheduleMainVoteParticipants } from "@/domains/schedule/components/schedule-main-vote-participants";
import { useGetMeetingSchedules } from "@/domains/schedule/hooks/use-get-meeting-schedules";
import { parseTime } from "@/domains/schedule/utils/parse";
import { toOccupancyFromParticipants } from "@/domains/schedule/utils/timetable";
import { Timetable } from "@/shared/components/timetable";

const EMPTY_PARTICIPANTS: ScheduleParticipant[] = [];

export interface ScheduleMainVoteContentProps {
  onParticipantEdit: () => void;
}

export function ScheduleMainVoteContent({
  onParticipantEdit,
}: ScheduleMainVoteContentProps) {
  const { meetingId } = useParams() as { meetingId: string };

  const schedulesQuery = useGetMeetingSchedules({ meetingId });

  const participants = schedulesQuery.data?.participants ?? EMPTY_PARTICIPANTS;

  const occupancy = useMemo(
    () => toOccupancyFromParticipants(participants),
    [participants],
  );

  const votedParticipantNames = useMemo(
    () =>
      participants.filter((p) => p.votedDates.length > 0).map((p) => p.name),
    [participants],
  );

  if (schedulesQuery.isPending || !schedulesQuery.data) {
    return (
      <div className="py-10 text-center text-b4 text-k-500">
        시간표를 불러오는 중이에요.
      </div>
    );
  }

  return (
    <>
      <ScheduleMainVoteParticipants
        meetingId={meetingId}
        participantCount={schedulesQuery.data.participantCount}
        votedParticipantCount={schedulesQuery.data.votedParticipantCount}
        votedParticipantNames={votedParticipantNames}
        onParticipantEdit={onParticipantEdit}
      />
      <Timetable
        className="mt-3"
        dates={schedulesQuery.data.dateOptions.map(
          (dateOption) => new Date(dateOption),
        )}
        startTime={parseTime(schedulesQuery.data.startTime, 9)}
        endTime={parseTime(schedulesQuery.data.endTime, 24)}
        occupancy={occupancy}
        disabled
        stickyHeaderTop={48}
      />
    </>
  );
}
