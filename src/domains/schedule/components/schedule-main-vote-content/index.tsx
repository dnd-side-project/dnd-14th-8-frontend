import { useParams } from "react-router";
import { ScheduleMainVoteParticipants } from "@/domains/schedule/components/schedule-main-vote-participants";
import { useGetMeetingScheduleVoteResults } from "@/domains/schedule/hooks/use-get-meeting-schedule-vote-results";
import { useGetMeetingSchedules } from "@/domains/schedule/hooks/use-get-meeting-schedules";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { parseHour } from "@/domains/schedule/utils/parse";
import { toScheduleOccupancy } from "@/domains/schedule/utils/timetable";
import { Timetable } from "@/shared/components/timetable";

export interface ScheduleMainVoteContentProps {
  onParticipantEdit: () => void;
}

export function ScheduleMainVoteContent({
  onParticipantEdit,
}: ScheduleMainVoteContentProps) {
  const { meetingId } = useParams() as { meetingId: string };

  const schedulesQuery = useGetMeetingSchedules({ meetingId });
  const voteResultsQuery = useGetMeetingScheduleVoteResults({ meetingId });
  const myParticipantQuery = useGetMyParticipant({ meetingId });

  if (
    schedulesQuery.isPending ||
    voteResultsQuery.isPending ||
    myParticipantQuery.isPending ||
    !schedulesQuery.data ||
    !voteResultsQuery.data ||
    !myParticipantQuery.data
  ) {
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
        votedParticipantNames={schedulesQuery.data.participants
          .filter((participant) => participant.scheduleVoteId)
          .map((participant) => participant.name)}
        onParticipantEdit={onParticipantEdit}
      />
      <Timetable
        className="mt-3"
        dates={schedulesQuery.data.dateOptions.map(
          (dateOption) => new Date(dateOption),
        )}
        startTime={parseHour(schedulesQuery.data.startTime, 9)}
        endTime={parseHour(schedulesQuery.data.endTime, 24)}
        occupancy={toScheduleOccupancy(
          voteResultsQuery.data.scheduleVoteResult,
        )}
        selected={voteResultsQuery.data.scheduleVoteResult
          .filter((result) =>
            result.availableParticipantNames.includes(
              myParticipantQuery.data.name,
            ),
          )
          .map(
            (result) => new Date(`${result.scheduleDate}T${result.startTime}`),
          )}
        disabled
        stickyHeaderTop={48}
      />
    </>
  );
}
