import { useNavigate } from "react-router";
import {
  LandingMidpointCharacter,
  LandingScheduleCharacter,
} from "@/assets/characters";
import MoyeorakLogo from "@/assets/moyeorak-logo.svg?react";
import { LandingGuideSection } from "@/domains/meeting/components/landing-guide-section";
import { LandingStatsBadge } from "@/domains/meeting/components/landing-stats-badge";
import { useMeetingStatsQuery } from "@/domains/meeting/hooks/use-meeting-stats-query";
import { ChevronDownIcon } from "@/shared/components/icons";
import { MainButton } from "@/shared/components/main-button";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function LandingPage() {
  const navigate = useNavigate();
  const { data: meetingStats } = useMeetingStatsQuery();

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pt-6 pb-6">
        <div className="mb-15 flex flex-col items-center">
          <MoyeorakLogo />
          <span className="text-b1 text-gray-750">
            모임을 더 즐겁게, 효율적으로 시작해요
          </span>
          <LandingStatsBadge
            todayCreatedMeetingCount={meetingStats?.todayCreatedMeetingCount}
          />
        </div>
        <div className="flex flex-col gap-4">
          <MainButton
            className="bg-primary-main"
            title="일정 조율하기"
            description={"쉽고 빠르게 일정을\n조율하세요!"}
            character={<LandingScheduleCharacter />}
            characterClassName="right-[-60px] bottom-[-90px]"
            onClick={() => navigate("/new/schedule")}
          />

          <MainButton
            className="bg-sub-main"
            title="중간 지점 찾기"
            description={"공평한 중간지점을\n찾아보세요!"}
            character={<LandingMidpointCharacter />}
            characterClassName="right-[-60px] bottom-[-115px]"
            onClick={() => navigate("/new/location")}
          />
        </div>

        <button
          type="button"
          className="mt-auto flex cursor-pointer flex-col items-center gap-1 pt-10 text-b2 text-gray-750"
          onClick={() =>
            document
              .getElementById("landing-guide")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          이용방법 보기
          <ChevronDownIcon />
        </button>
      </section>

      <LandingGuideSection />
    </MobileLayout>
  );
}
