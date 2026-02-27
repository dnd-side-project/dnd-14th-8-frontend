import { useLocation } from "react-router";
import {
  InvitationMidpointCharacter,
  InvitationScheduleCharacter,
} from "@/assets/characters";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";

interface MeetingJoinInviteProps {
  hostName: string;
  onJoin: () => void;
}

export function MeetingJoinInvite({
  hostName,
  onJoin,
}: MeetingJoinInviteProps) {
  const { pathname } = useLocation();

  const isLocationFlow = pathname.includes("location");

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col bg-p-50 px-5 pb-5">
        <div className="mt-11 text-center">
          <p className="mb-4 text-h1 text-k-900">
            <span className="text-primary-main">{hostName}</span>님의 모임에{" "}
            <br />
            초대되었어요!
          </p>
          {isLocationFlow ? (
            <p className="text-b1 text-k-800">
              모임에 참여해서 중간 지점을 찾아보세요.
            </p>
          ) : (
            <p className="text-b1 text-k-800">
              모임에 참여해서 일정을 조율해 보세요.
            </p>
          )}
        </div>

        <div className="mt-30 flex items-center justify-center">
          {isLocationFlow ? (
            <InvitationMidpointCharacter />
          ) : (
            <InvitationScheduleCharacter />
          )}
        </div>

        <div className="mt-auto">
          <ButtonBottom variant="blue" onClick={onJoin}>
            모임 참여하기
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
