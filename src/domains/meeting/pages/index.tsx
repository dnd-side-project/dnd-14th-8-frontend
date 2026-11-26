import { useNavigate } from "react-router";
import landingLocationGraphic from "@/assets/characters/landing-location.webp";
import landingScheduleGraphic from "@/assets/characters/landing-schedule.webp";
import MoyeorakLogo from "@/assets/logos/moyeorak-white.svg?react";
import { FlowSelectCard } from "@/domains/meeting/components/flow-select-card";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col bg-bg-neutral-strongest px-5 pt-10 pb-6">
        <div className="mb-20 flex flex-col items-center">
          <MoyeorakLogo />
          <span className="textStyle_body1 text-fg-neutral-subtler">
            모임을 더 즐겁게, 효율적으로
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <FlowSelectCard
            title="일정 조율하기"
            description="모두가 가능한 시간 찾기"
            graphicSrc={landingScheduleGraphic}
            titleClassName="text-fg-neutral-faintest"
            descriptionClassName="text-fg-brand-subtle"
            onClick={() => navigate("/new/schedule")}
          />

          <FlowSelectCard
            title="중간 장소 찾기"
            description="모두가 효율적인 장소 찾기"
            graphicSrc={landingLocationGraphic}
            className="shadow-[0_0_8px_var(--colors-shadow-neutral-default)]"
            titleClassName="text-fg-brand-default"
            descriptionClassName="text-fg-neutral-subtler"
            onClick={() => navigate("/new/location")}
          />
        </div>
      </section>
    </MobileLayout>
  );
}
