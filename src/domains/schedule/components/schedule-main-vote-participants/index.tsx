import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { Chip } from "@/shared/components/chip";
import { ChevronRightIcon, MemberIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export function ScheduleMainVoteParticipants({
  meetingId,
  participantCount,
  votedParticipantCount,
  votedParticipantNames,
  onParticipantEdit,
}: {
  meetingId: string;
  participantCount: number;
  votedParticipantCount: number;
  votedParticipantNames: string[];
  onParticipantEdit: () => void;
}) {
  const { data } = useGetMyParticipant({ meetingId });

  const handleClickParticipantEdit = () => {
    if (data?.isHost) {
      onParticipantEdit();
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleClickParticipantEdit}
        className={cn(
          "flex items-center py-1 text-k-800 text-t2",
          data?.isHost && "cursor-pointer",
        )}
      >
        <MemberIcon className="size-5" />
        <span className="mr-0.5">참여자</span>
        <span className="text-primary-main">{votedParticipantCount}</span>
        <span className="mr-0.5">/{participantCount}</span>
        {data?.isHost && <ChevronRightIcon className="size-4 text-k-400" />}
      </button>
      {votedParticipantNames.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto">
          {votedParticipantNames.map((name) => (
            <Chip key={name}>{name}</Chip>
          ))}
        </div>
      )}
    </section>
  );
}
