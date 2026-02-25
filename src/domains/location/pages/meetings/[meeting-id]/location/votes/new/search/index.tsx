import { useNavigate } from "react-router";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function DepartureNewSearchPage() {
  const navigate = useNavigate();
  return (
    <MobileLayout>
      출발지 추가에서 장소 찾기 페이지
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="장소 찾기" onBack={() => navigate("..")} />

        <div className="mt-auto">
          <ButtonBottom onClick={() => navigate("/new")} variant="white">
            모임 개설 페이지로 이동
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
