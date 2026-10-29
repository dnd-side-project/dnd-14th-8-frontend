import { describe, expect, it } from "vitest";
import { getScheduleDateSummary } from "./date-summary";

const toDates = (days: number[]) => days.map((day) => new Date(2026, 11, day));

describe("getScheduleDateSummary", () => {
  it("날짜가 없으면 대시를 표시한다", () => {
    expect(getScheduleDateSummary([])).toEqual({ label: "-", overflow: 0 });
  });

  it("날짜가 하나면 그 날짜만 표시한다", () => {
    expect(getScheduleDateSummary(toDates([24]))).toEqual({
      label: "12.24",
      overflow: 0,
    });
  });

  it("연속된 날짜는 범위로 묶는다", () => {
    expect(getScheduleDateSummary(toDates([24, 25, 26]))).toEqual({
      label: "12.24-12.26",
      overflow: 0,
    });
  });

  it("연속 범위 밖의 개별 날짜는 개수로 센다", () => {
    expect(getScheduleDateSummary(toDates([24, 25, 27, 29, 30]))).toEqual({
      label: "12.24-12.25",
      overflow: 3,
    });
  });

  it("연속된 날짜가 없으면 앞의 두 날짜를 보여주고 나머지를 센다", () => {
    expect(getScheduleDateSummary(toDates([24, 26, 28, 30]))).toEqual({
      label: "12.24, 12.26",
      overflow: 2,
    });
  });

  it("중복 날짜와 순서를 정리한 뒤 계산한다", () => {
    expect(getScheduleDateSummary(toDates([25, 24, 25]))).toEqual({
      label: "12.24-12.25",
      overflow: 0,
    });
  });
});
