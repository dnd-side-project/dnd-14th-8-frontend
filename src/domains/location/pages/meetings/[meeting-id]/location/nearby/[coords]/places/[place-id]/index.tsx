import { useNavigate } from "react-router";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function PlaceDetailPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="fixed inset-0 z-10 flex items-end">
        <button
          aria-label="특정 시설 확인 닫기"
          className="absolute inset-0"
          onClick={() => navigate("..")}
          type="button"
        />

        <section className="relative z-10 flex w-full flex-col rounded-t-2xl bg-k-5 pb-5 shadow-[0_-15px_18px_0_rgba(0,0,0,0.1)]">
          <PageHeader
            title="특정 시설 확인"
            onBack={() => navigate("..")}
            className="px-5"
          />

          <div className="px-5">
            <ButtonBottom onClick={() => navigate("..")} variant="white">
              닫기
            </ButtonBottom>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}
