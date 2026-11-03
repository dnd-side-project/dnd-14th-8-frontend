import { Badge, Icon } from "@moyeorak/design-system";
import { useMeetingPermissions } from "@/domains/meeting/hooks/use-meeting-permissions";
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
  const { permissions } = useMeetingPermissions(meetingId);
  const canEdit = permissions.canEditParticipantCount;

  const handleClickParticipantEdit = () => {
    if (canEdit) {
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
          canEdit && "cursor-pointer",
        )}
      >
        <Icon type="member" size="sm" />
        <span className="mr-0.5">참여자</span>
        <span className="text-fg-brand-default">{votedParticipantCount}</span>
        <span className="mr-0.5">/{participantCount}</span>
        {canEdit && <Icon type="chevron_right" size="xs" variant="weak" />}
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
