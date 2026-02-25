import { useNavigate } from "react-router";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function DepartureEditSearchPage() {
  const navigate = useNavigate();
  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="장소 찾기" onBack={() => navigate(-1)} />
      </section>
    </MobileLayout>
  );
}
