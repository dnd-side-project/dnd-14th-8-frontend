import { Badge } from "@moyeorak/design-system";
import { useMeetingPermissions } from "@/domains/meeting/hooks/use-meeting-permissions";
import { ParticipantCount } from "@/shared/components/participant-count";

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

  return (
    <section className="flex flex-col gap-3">
      <ParticipantCount
        count={votedParticipantCount}
        total={participantCount}
        onClick={canEdit ? onParticipantEdit : undefined}
      />
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
