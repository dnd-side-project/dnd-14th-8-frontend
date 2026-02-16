import { Link, Outlet, useParams, useSearchParams } from "react-router";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function ScheduleMainPage() {
  const { meetingId } = useParams();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "optimal" ? "optimal" : "vote";

  return (
    <MobileLayout>
      <section className="flex flex-col gap-4 p-5">
        <h1 className="text-h2 text-k-900">일정 메인 화면</h1>
        <p className="text-b5 text-k-700">meetingId: {meetingId}</p>
        <p className="text-b5 text-k-700">tab: {tab}</p>

        <div className="flex flex-col gap-2">
          <Link
            className="rounded-md border border-k-200 px-4 py-3 text-center text-b4 text-k-800 transition-colors hover:bg-k-10 active:bg-k-50"
            to="edit/dates"
          >
            시간표 기간 편집
          </Link>
          <Link
            className="rounded-md border border-k-200 px-4 py-3 text-center text-b4 text-k-800 transition-colors hover:bg-k-10 active:bg-k-50"
            to="edit/participants"
          >
            모임 인원 수정
          </Link>
          <Link
            className="rounded-md border border-k-200 px-4 py-3 text-center text-b4 text-k-800 transition-colors hover:bg-k-10 active:bg-k-50"
            to="votes"
          >
            일정 추가하기
          </Link>
        </div>
      </section>

      <Outlet />
    </MobileLayout>
  );
}
