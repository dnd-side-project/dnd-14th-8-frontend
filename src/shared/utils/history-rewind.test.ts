import { describe, expect, it } from "vitest";
import { getHistoryRewindDelta } from "@/shared/utils/history-rewind";

describe("getHistoryRewindDelta", () => {
  it("폼이 바로 위에 쌓였으면 한 칸만 되감는다", () => {
    expect(getHistoryRewindDelta({ currentIdx: 1, entryIdx: 1 })).toBe(-1);
  });

  it("장소 검색을 다녀와 쌓인 항목까지 한 번에 되감는다", () => {
    expect(getHistoryRewindDelta({ currentIdx: 3, entryIdx: 1 })).toBe(-3);
  });

  it("검색을 여러 번 다녀와도 원래 화면 한 칸 아래로 맞춘다", () => {
    expect(getHistoryRewindDelta({ currentIdx: 7, entryIdx: 2 })).toBe(-6);
  });

  it("폼이 첫 항목이면 되감을 곳이 앱 밖이라 포기한다", () => {
    expect(getHistoryRewindDelta({ currentIdx: 0, entryIdx: 0 })).toBeNull();
  });

  it("진입 위치를 모르면 포기한다", () => {
    expect(getHistoryRewindDelta({ currentIdx: 3, entryIdx: null })).toBeNull();
    expect(
      getHistoryRewindDelta({ currentIdx: 3, entryIdx: undefined }),
    ).toBeNull();
  });

  it("현재 위치를 모르면 포기한다", () => {
    expect(getHistoryRewindDelta({ currentIdx: null, entryIdx: 1 })).toBeNull();
  });

  it("진입 시점보다 앞에 있는 예상 밖 스택이면 포기한다", () => {
    expect(getHistoryRewindDelta({ currentIdx: 0, entryIdx: 2 })).toBeNull();
  });
});
