import { Badge } from "@moyeorak/design-system";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
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
          "textStyle_title3 flex items-center py-1 text-fg-neutral-strong",
          data?.isHost && "cursor-pointer",
        )}
      >
        <MemberIcon className="size-5" />
        <span className="mr-0.5">참여자</span>
        <span className="text-fg-brand-default">{votedParticipantCount}</span>
        <span className="mr-0.5">/{participantCount}</span>
        {data?.isHost && (
          <ChevronRightIcon className="size-4 text-fg-neutral-subtler" />
        )}
      </button>
      {votedParticipantNames.length > 0 && (
        <div className="scrollbar-hide flex gap-1.5 overflow-x-auto">
          {votedParticipantNames.map((name) => (
            <Badge key={name} size="md" variant="outline" className="shrink-0">
              {name}
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}
