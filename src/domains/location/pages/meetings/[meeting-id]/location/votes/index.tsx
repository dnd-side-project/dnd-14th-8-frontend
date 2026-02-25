import { useNavigate } from "react-router";
import { ButtonSubStroke } from "@/domains/location/components/button-sub-stroke";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function DepartureListPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      출발지 관리 페이지
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 관리" onBack={() => navigate(-1)} />
        <ButtonSubStroke
          onClick={() => navigate("/meetings/:meetingId/location/votes/new")}
        >
          출발지 추가하기
        </ButtonSubStroke>
      </section>
    </MobileLayout>
  );
}
