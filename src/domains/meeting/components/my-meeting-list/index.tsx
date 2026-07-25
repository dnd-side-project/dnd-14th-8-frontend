import type { MyMeetingResponse } from "@/domains/meeting/types/meeting-api-types";
import { ChevronRightIcon } from "@/shared/components/icons";

const RECENT_MEETING_LIMIT = 5;

interface MyMeetingListProps {
  meetings: MyMeetingResponse[];
  onSelect: (meeting: MyMeetingResponse) => void;
}

export function MyMeetingList({ meetings, onSelect }: MyMeetingListProps) {
  if (meetings.length === 0) {
    return null;
  }

  return (
    <section className="mt-7 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-k-900 text-t2">최근 모임</h2>
      </div>

      <ul className="flex flex-col gap-2">
        {meetings.slice(0, RECENT_MEETING_LIMIT).map((meeting) => (
          <li key={meeting.meetingId}>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-k-100 bg-k-5 px-4 py-3 text-left shadow-[0_2px_6px_0_rgba(22,22,26,0.06)] transition-colors hover:bg-k-10 focus-visible:outline-2 focus-visible:outline-primary-main focus-visible:outline-offset-2"
              onClick={() => onSelect(meeting)}
            >
              <span className="min-w-0">
                <span className="block truncate text-k-900 text-t2">
                  {meeting.hostName}님의 모임
                </span>
                <span className="mt-1 block text-b2 text-k-600">
                  {getRoleLabel(meeting.isHost)} · {meeting.participantCount}명
                  · {formatCreatedDate(meeting.createdAt)} 생성
                </span>
              </span>
              <ChevronRightIcon className="shrink-0 text-k-500" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function getRoleLabel(isHost: boolean) {
  return isHost ? "팀장" : "참여자";
}

function formatCreatedDate(createdAt: string) {
  const [, month, day] = createdAt.slice(0, 10).split("-");

  return `${Number(month)}월 ${Number(day)}일`;
}
