import { Outlet, useNavigate } from "react-router";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function ScheduleMainPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="일정 메인 화면" />

        <div className="mt-4 flex flex-col gap-2">
          <ButtonBottom onClick={() => navigate("edit/dates")} variant="white">
            시간표 기간 편집
          </ButtonBottom>
          <ButtonBottom
            onClick={() => navigate("edit/participants")}
            variant="white"
          >
            모임 인원 수정
          </ButtonBottom>
          <ButtonBottom onClick={() => navigate("votes")} variant="white">
            일정 추가하기
          </ButtonBottom>
        </div>
      </section>
      <Outlet />
    </MobileLayout>
  );
}
