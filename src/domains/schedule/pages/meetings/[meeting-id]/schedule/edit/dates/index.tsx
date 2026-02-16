import { useNavigate, useParams } from "react-router";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function ScheduleEditDatesPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();

  return (
    <MobileLayout>
      <div className="fixed inset-0 z-10 flex items-end bg-k-900/40">
        <button
          aria-label="시간표 기간 편집 닫기"
          className="absolute inset-0"
          onClick={() => navigate("..")}
          type="button"
        />

        <section className="relative z-10 flex w-full flex-col gap-4 rounded-t-2xl bg-k-5 p-5">
          <h1 className="text-k-900 text-t1">시간표 기간 편집 Bottom Sheet</h1>
          <p className="text-b5 text-k-700">meetingId: {meetingId}</p>

          <button
            className="rounded-md border border-k-200 px-4 py-3 text-center text-b4 text-k-800 transition-colors hover:bg-k-10 active:bg-k-50"
            onClick={() => navigate("..")}
            type="button"
          >
            닫기
          </button>
        </section>
      </div>
    </MobileLayout>
  );
}
