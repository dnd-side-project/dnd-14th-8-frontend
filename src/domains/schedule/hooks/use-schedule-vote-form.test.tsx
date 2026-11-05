// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScheduleVotesPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/votes";
import { toast } from "@/shared/components/toast";

const NAME_REQUIRED = "이름을 입력해주세요";
const NAME_TOO_LONG = "최대 4자까지 입력할 수 있어요";
const NO_SELECTED_TIME = "가능한 시간을 선택해주세요";
const VOTED_DATE = "2026-12-24T10:00:00";

const mocks = vi.hoisted(() => ({
  createVote: vi.fn(),
  myParticipant: undefined as
    | { name: string; participantId: number; scheduleVoteId: number }
    | undefined,
  schedules: undefined as unknown,
  updateVote: vi.fn(),
}));

vi.mock("@/domains/schedule/hooks/use-get-meeting-schedules", () => ({
  getMeetingSchedulesQueryKey: () => ["schedules"],
  useGetMeetingSchedules: () => ({ data: mocks.schedules, isPending: false }),
}));

vi.mock("@/domains/schedule/hooks/use-get-my-participant", () => ({
  getMyParticipantQueryKey: () => ["my-participant"],
  useGetMyParticipant: () => ({ data: mocks.myParticipant }),
}));

vi.mock(
  "@/domains/schedule/hooks/use-get-meeting-schedule-vote-results",
  () => ({ getMeetingScheduleVoteResultsQueryKey: () => ["results"] }),
);

vi.mock("@/domains/schedule/hooks/use-create-schedule-vote", () => ({
  useCreateScheduleVote: () => ({
    isPending: false,
    mutateAsync: mocks.createVote,
  }),
}));

vi.mock("@/domains/schedule/hooks/use-update-schedule-vote", () => ({
  useUpdateScheduleVote: () => ({
    isPending: false,
    mutateAsync: mocks.updateVote,
  }),
}));

vi.mock("@/domains/meeting/hooks/use-meeting-permissions", () => ({
  useMeetingPermissions: () => ({
    isLoading: false,
    permissions: { canVote: true },
  }),
}));

vi.mock("@/shared/hooks/use-flow-return", () => ({
  useFlowEntryIndex: () => 0,
  useFlowReturn: () => vi.fn(),
}));

vi.mock("@/shared/components/toast", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("@/shared/components/floating-scroll-top", () => ({
  FloatingScrollTop: () => null,
}));

vi.mock("@/shared/components/react-hook-form-devtools", () => ({
  ReactHookFormDevtools: () => null,
}));

// 시간표 드래그는 이 테스트의 대상이 아니라서 값만 바꾸는 버튼으로 대신한다.
vi.mock("@/shared/components/timetable", () => ({
  Timetable: ({
    onSelect,
    selected,
  }: {
    onSelect: (dates: Date[]) => void;
    selected: Date[];
  }) => (
    <button type="button" onClick={() => onSelect([new Date(VOTED_DATE)])}>
      시간 선택 {selected.length}개
    </button>
  ),
}));

// jsdom에는 ResizeObserver가 없다.
vi.stubGlobal(
  "ResizeObserver",
  class {
    disconnect() {}
    observe() {}
    unobserve() {}
  },
);

function setServerData({
  name,
  votedDates = [],
}: {
  name?: string;
  votedDates?: string[];
} = {}) {
  mocks.myParticipant = name
    ? { name, participantId: 1, scheduleVoteId: 10 }
    : undefined;
  mocks.schedules = {
    dateOptions: ["2026-12-24"],
    endTime: "12:00:00",
    participants: name ? [{ name, votedDates }] : [],
    startTime: "09:00:00",
  };
}

// 검증은 비동기라서, 에러가 없다고 단정하기 전에 끝날 때까지 기다린다.
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve));
  });

async function renderForm() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={["/meetings/meeting-1/schedule/votes"]}>
        <Routes>
          <Route
            path="/meetings/:meetingId/schedule/votes"
            element={<ScheduleVotesPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
  await settle();
}

async function typeName(value: string) {
  fireEvent.change(screen.getByRole("textbox"), { target: { value } });
  await settle();
}

async function selectTime() {
  fireEvent.click(screen.getByRole("button", { name: /시간 선택/ }));
  await settle();
}

async function pressDone() {
  fireEvent.click(screen.getByRole("button", { name: "완료" }));
  await settle();
}

async function confirmReset() {
  fireEvent.click(screen.getByRole("button", { name: "초기화" }));
  await settle();
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "초기화" }),
  );
  await settle();
}

describe("일정 입력 폼의 이름 에러", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setServerData();
  });

  afterEach(cleanup);

  it("처음 들어왔을 때는 이름 칸이 에러가 아니다", async () => {
    await renderForm();

    expect(screen.queryByText(NAME_REQUIRED)).toBeNull();
  });

  it("이름을 입력했다가 지우면 에러가 보인다", async () => {
    await renderForm();

    await typeName("락이");
    expect(screen.queryByText(NAME_REQUIRED)).toBeNull();

    await typeName("");
    expect(screen.getByText(NAME_REQUIRED)).toBeTruthy();
  });

  it("4자를 넘기면 에러가 보이고 줄이면 사라진다", async () => {
    await renderForm();

    await typeName("다섯글자야");
    expect(screen.getByText(NAME_TOO_LONG)).toBeTruthy();

    await typeName("네글자야");
    expect(screen.queryByText(NAME_TOO_LONG)).toBeNull();
  });

  it("시간을 먼저 골라도 이름 칸은 에러가 아니다", async () => {
    await renderForm();

    await selectTime();

    expect(screen.queryByText(NAME_REQUIRED)).toBeNull();
  });
});

describe("비활성 완료 버튼의 토스트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setServerData();
  });

  afterEach(cleanup);

  it("아무것도 입력하지 않으면 이름 에러를 먼저 알리고 이름 칸에도 보여 준다", async () => {
    await renderForm();

    await pressDone();

    expect(vi.mocked(toast.error).mock.calls).toEqual([[NAME_REQUIRED]]);
    expect(screen.getByText(NAME_REQUIRED)).toBeTruthy();
  });

  it("시간만 고르고 이름이 비어 있으면 이름 에러를 알린다", async () => {
    await renderForm();

    await selectTime();
    await pressDone();

    expect(vi.mocked(toast.error).mock.calls).toEqual([[NAME_REQUIRED]]);
  });

  it("이름이 4자를 넘으면 길이 에러를 알린다", async () => {
    await renderForm();

    await typeName("다섯글자야");
    await pressDone();

    expect(vi.mocked(toast.error).mock.calls).toEqual([[NAME_TOO_LONG]]);
  });

  it("이름이 맞고 시간이 없으면 시간 선택을 알린다", async () => {
    await renderForm();

    await typeName("락이");
    await pressDone();

    expect(vi.mocked(toast.error).mock.calls).toEqual([[NO_SELECTED_TIME]]);
  });

  it("이름과 시간이 모두 맞으면 토스트 없이 제출한다", async () => {
    await renderForm();

    await typeName("락이");
    await selectTime();
    await pressDone();

    expect(toast.error).not.toHaveBeenCalled();
    expect(mocks.createVote).toHaveBeenCalledTimes(1);
  });
});

describe("일정 수정으로 들어온 경우", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  it("기존 값이 맞으면 trigger 없이도 바로 제출할 수 있다", async () => {
    setServerData({ name: "락이", votedDates: [VOTED_DATE] });
    await renderForm();

    await pressDone();

    expect(toast.error).not.toHaveBeenCalled();
    expect(mocks.updateVote).toHaveBeenCalledTimes(1);
  });

  it("기존 이름이 규칙에 맞지 않으면 완료를 막고 누른 뒤에 에러를 보여 준다", async () => {
    setServerData({ name: "다섯글자야", votedDates: [VOTED_DATE] });
    await renderForm();

    expect(screen.queryByText(NAME_TOO_LONG)).toBeNull();

    await pressDone();

    expect(vi.mocked(toast.error).mock.calls).toEqual([[NAME_TOO_LONG]]);
    expect(screen.getByText(NAME_TOO_LONG)).toBeTruthy();
    expect(mocks.updateVote).not.toHaveBeenCalled();
  });
});

describe("초기화를 누른 뒤", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setServerData();
  });

  afterEach(cleanup);

  it("입력을 시작하지 않았으면 이름 칸은 에러가 아니고 토스트는 이름부터 알린다", async () => {
    await renderForm();

    await selectTime();
    await confirmReset();
    expect(screen.queryByText(NAME_REQUIRED)).toBeNull();

    await pressDone();
    expect(vi.mocked(toast.error).mock.calls).toEqual([[NAME_REQUIRED]]);
  });

  it("이름이 맞으면 이름을 유지하고 토스트는 시간 선택을 알린다", async () => {
    await renderForm();

    await typeName("락이");
    await selectTime();
    await confirmReset();

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("락이");
    expect(screen.getByRole("button", { name: /시간 선택 0개/ })).toBeTruthy();

    await pressDone();
    expect(vi.mocked(toast.error).mock.calls).toEqual([[NO_SELECTED_TIME]]);
  });

  it("이름 칸에 보이던 에러는 그대로 남는다", async () => {
    await renderForm();

    await typeName("다섯글자야");
    await confirmReset();

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe(
      "다섯글자야",
    );
    expect(screen.getByText(NAME_TOO_LONG)).toBeTruthy();
  });
});
