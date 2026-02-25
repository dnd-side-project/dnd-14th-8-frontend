import { useNavigate } from "react-router";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function DepartureNewPage() {
  const navigate = useNavigate();
  return (
    <MobileLayout>
      출발지 추가 페이지
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 추가" onBack={() => navigate("..")} />
      </section>
    </MobileLayout>
  );
}
