import { useNavigate } from "react-router";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function DepartureNewPage() {
  const navigate = useNavigate();
  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 추가" onBack={() => navigate(-1)} />
        <ButtonBottom onClick={() => navigate("search")} variant="white">
          장소 찾기
        </ButtonBottom>
      </section>
    </MobileLayout>
  );
}
