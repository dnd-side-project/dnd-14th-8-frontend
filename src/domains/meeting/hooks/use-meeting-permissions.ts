import {
  getMeetingPermissions,
  getMeetingRole,
} from "@/domains/meeting/utils/meeting-permissions";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";

export function useMeetingPermissions(meetingId: string) {
  const { data: me, isLoading } = useGetMyParticipant({ meetingId });

  const role = getMeetingRole(me);

  return {
    role,
    permissions: getMeetingPermissions({ role }),
    isLoading,
  };
}
