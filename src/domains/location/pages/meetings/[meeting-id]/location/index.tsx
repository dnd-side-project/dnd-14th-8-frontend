import { Outlet, useNavigate } from "react-router";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function MapDefaultPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="지도 기본 화면" />

        <div className="mt-4 flex flex-col gap-2">
          <ButtonBottom onClick={() => navigate("votes")} variant="white">
            출발지 관리하기
          </ButtonBottom>
          <ButtonBottom onClick={() => navigate("votes/new")} variant="white">
            출발지 추가하기
          </ButtonBottom>
          <ButtonBottom onClick={() => navigate("stations")} variant="white">
            장소 메인 화면
          </ButtonBottom>
          <ButtonBottom
            onClick={() =>
              navigate("stations/:stationId/participants/:participantId")
            }
            variant="white"
          >
            루트 및 시간 확인 화면
          </ButtonBottom>
          <ButtonBottom
            onClick={() => navigate("nearby/:coords")}
            variant="white"
          >
            주변 둘러보기 화면
          </ButtonBottom>
          <ButtonBottom
            onClick={() => navigate("nearby/:coords/places/:placeId")}
            variant="white"
          >
            특정 시설 확인 화면
          </ButtonBottom>
        </div>
      </section>
      <Outlet />
    </MobileLayout>
  );
}
