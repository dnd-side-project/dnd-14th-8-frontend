import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import type { GetMeetingScheduleResponse } from "@/domains/meeting/types/meeting-api-types";
import { ScheduleMainVoteContent } from "@/domains/schedule/components/schedule-main-vote-content";
import { getMeetingSchedulesQueryKey } from "@/domains/schedule/hooks/use-get-meeting-schedules";
import { getMyParticipantQueryKey } from "@/domains/schedule/hooks/use-get-my-participant";
import { getGuestId } from "@/shared/utils/auth";

const MEETING_ID = "1";

const schedules: GetMeetingScheduleResponse = {
  meetingId: MEETING_ID,
  dateOptions: ["2026-02-18", "2026-02-19", "2026-02-20"],
  startTime: "09:00",
  endTime: "11:00",
  participantCount: 3,
  participants: [{ name: "지수", votedDates: [] }],
  votedParticipantCount: 0,
  pollStatus: "IN_PROGRESS",
};

/** 네트워크 없이 화면을 띄우기 위해 캐시를 미리 채운다. */
function createSeededQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  queryClient.setQueryData(
    getMeetingSchedulesQueryKey({ meetingId: MEETING_ID }),
    schedules,
  );
  queryClient.setQueryData(
    getMyParticipantQueryKey({
      localStorageKey: getGuestId(),
      meetingId: MEETING_ID,
    }),
    { isHost: false },
  );

  return queryClient;
}

const meta: Meta<typeof ScheduleMainVoteContent> = {
  title: "schedule/ScheduleMainVoteContent",
  component: ScheduleMainVoteContent,
  decorators: [
    (Story) => (
      <QueryClientProvider client={createSeededQueryClient()}>
        <MemoryRouter initialEntries={[`/meetings/${MEETING_ID}`]}>
          <Routes>
            <Route
              path="/meetings/:meetingId"
              element={
                <div className="w-[375px] px-5 py-3">
                  <Story />
                </div>
              }
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ScheduleMainVoteContent>;

/**
 * 메인 시간표는 읽기 전용이지만 사용자는 자기 시간을 넣으려고 격자를 누른다.
 * 그 탭은 하단 "일정 추가하기"와 같은 곳으로 가야 한다.
 */
export const TapTimetableToVote: Story = {
  name: "시간표를 탭하면 일정 추가로",
  args: { onParticipantEdit: fn(), onVoteAction: fn() },
  play: async ({ args, canvasElement }) => {
    const slot = canvasElement.querySelector<HTMLElement>(
      '[data-date-idx="1"][data-slot-idx="2"]',
    );
    if (!slot) throw new Error("시간표 슬롯을 찾지 못했어요");

    await userEvent.pointer([
      {
        keys: "[MouseLeft>]",
        target: slot,
        coords: { clientX: 120, clientY: 300 },
      },
      {
        keys: "[/MouseLeft]",
        target: slot,
        coords: { clientX: 121, clientY: 300 },
      },
    ]);

    await expect(args.onVoteAction).toHaveBeenCalledTimes(1);
  },
};
