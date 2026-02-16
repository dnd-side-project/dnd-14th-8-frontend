import { Link } from "react-router";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function NewMeetingPage() {
  return (
    <MobileLayout>
      <section className="flex flex-col gap-4 p-5">
        <h1 className="text-h2 text-k-900">모임 개설 페이지</h1>
        <p className="text-b5 text-k-600">
          여기에 모임 생성 폼이 들어갈 예정입니다.
        </p>

        <Link
          className="rounded-md border border-k-200 px-4 py-3 text-center text-b4 text-k-800 transition-colors hover:bg-k-10 active:bg-k-50"
          to="/meetings/sample-meeting-id/schedule"
        >
          개설 후 일정 화면으로 이동
        </Link>
      </section>
    </MobileLayout>
  );
}
