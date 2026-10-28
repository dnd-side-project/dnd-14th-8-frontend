import { useNavigate } from "react-router";
import mainLocationGraphic from "@/assets/graphic/main-location.svg";
import mainScheduleGraphic from "@/assets/graphic/main-schedule.svg";
import MoyeorakLogo from "@/assets/moyeorak-logo-white.svg?react";
import { MainButton } from "@/shared/components/main-button";
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
          <MainButton
            title="일정 조율하기"
            description="모두가 가능한 시간 찾기"
            graphicSrc={mainScheduleGraphic}
            titleClassName="text-fg-neutral-faintest"
            descriptionClassName="text-fg-brand-subtle"
            onClick={() => navigate("/new/schedule")}
          />

          <MainButton
            title="중간 장소 찾기"
            description="모두가 효율적인 장소 찾기"
            graphicSrc={mainLocationGraphic}
            // 그래픽에 그림자가 포함되어 335x140 카드 바깥으로 8px씩 여백이 있어
            // 카드 영역에 맞도록 여백만큼 밖으로 확장한다.
            graphicClassName="inset-auto top-[-5.714%] left-[-2.388%] h-[111.429%] w-[104.776%] max-w-none"
            titleClassName="text-fg-brand-default"
            descriptionClassName="text-fg-neutral-subtler"
            onClick={() => navigate("/new/location")}
          />
        </div>
      </section>
    </MobileLayout>
  );
}
