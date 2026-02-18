import { useNavigate } from "react-router";
import { useAllMeetingsQuery } from "@/domains/meeting/hooks/use-all-meetings-query";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { Chip } from "@/shared/components/chip";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function LandingPage() {
  const navigate = useNavigate();
  const { data: meetingIds, isError, isPending } = useAllMeetingsQuery();

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="모임 랜딩 페이지" />

        <div className="mt-2 flex flex-col gap-2">
          <h2 className="text-k-700 text-t2">테스트 모임 목록</h2>

          {isPending ? (
            <p className="text-b4 text-k-500">모임 목록을 불러오는 중이에요.</p>
          ) : isError ? (
            <p className="text-action-red text-b4">
              모임 목록을 불러오지 못했어요.
            </p>
          ) : meetingIds.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {meetingIds.map((meetingId) => (
                <Chip key={meetingId} size="sm">
                  {meetingId}
                </Chip>
              ))}
            </div>
          ) : (
            <p className="text-b4 text-k-500">생성된 모임이 없어요.</p>
          )}
        </div>

        <div className="mt-auto">
          <ButtonBottom onClick={() => navigate("/new")} variant="white">
            모임 개설 페이지로 이동
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
