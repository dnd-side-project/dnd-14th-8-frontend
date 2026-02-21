import { useNavigate } from "react-router";
import MoyeorakLogo from "@/assets/moyeorak-logo.svg?react";
import { MainButton } from "@/shared/components/main-button";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pt-6">
        <div className="mb-15 flex flex-col items-center">
          <MoyeorakLogo />
          <span className="text-b1 text-gray-750">
            모임을 더 즐겁게, 효율적으로 시작해요
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <MainButton
            className="bg-primary-main"
            title="일정 조율하기"
            description={"쉽고 빠르게 일정을\n조율하세요!"}
            onClick={() => navigate("/new/schedule")}
          />

          <MainButton
            className="bg-sub-main"
            title="중간 지점 찾기"
            description={"공평한 중간지점을\n찾아보세요!"}
            onClick={() => navigate("/new/location")}
          />
        </div>
      </section>
    </MobileLayout>
  );
}
