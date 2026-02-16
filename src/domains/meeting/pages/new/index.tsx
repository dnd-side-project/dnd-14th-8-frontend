import { useNavigate } from "react-router";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function NewMeetingPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="모임 개설 페이지" onBack={() => navigate("/")} />

        <div className="mt-auto">
          <ButtonBottom
            onClick={() => navigate("/meetings/sample-meeting-id/schedule")}
            variant="blue"
          >
            개설 후 일정 화면으로 이동
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
