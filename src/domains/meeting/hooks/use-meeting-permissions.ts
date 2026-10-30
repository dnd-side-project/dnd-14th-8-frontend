import {
  getMeetingPermissions,
  getMeetingRole,
  toMeetingPhase,
} from "@/domains/meeting/utils/meeting-permissions";
import { useGetMeetingSchedules } from "@/domains/schedule/hooks/use-get-meeting-schedules";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";

export function useMeetingPermissions(meetingId: string) {
  const { data: me, isLoading: isMeLoading } = useGetMyParticipant({
    meetingId,
  });
  const { data: schedules, isLoading: isSchedulesLoading } =
    useGetMeetingSchedules({ meetingId });

  const role = getMeetingRole(me);
  const phase = toMeetingPhase(schedules?.pollStatus);

  return {
    role,
    phase,
    permissions: getMeetingPermissions({ role, phase }),
    isLoading: isMeLoading || isSchedulesLoading,
  };
}
