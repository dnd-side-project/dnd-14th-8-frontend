import { describe, expect, it } from "vitest";
import {
  formatDuration,
  formatStationName,
  getDurationParts,
} from "@/domains/location/utils/format";

describe("formatStationName", () => {
  it("역 이름 뒤에 '역'을 붙인다", () => {
    expect(formatStationName("을지로3가")).toBe("을지로3가역");
    expect(formatStationName("동대문역사문화공원")).toBe(
      "동대문역사문화공원역",
    );
  });

  it("이미 '역'으로 끝나면 붙이지 않는다", () => {
    expect(formatStationName("서울역")).toBe("서울역");
  });

  it("빈 이름에는 '역'만 남기지 않는다", () => {
    expect(formatStationName("")).toBe("");
    expect(formatStationName("  ")).toBe("");
  });
});

describe("getDurationParts", () => {
  it("1시간이 안 되면 분만 돌려준다", () => {
    expect(getDurationParts(27)).toEqual([{ value: 27, unit: "분" }]);
  });

  it("1시간 이상이면 시간과 분을 나눠 돌려준다", () => {
    expect(getDurationParts(70)).toEqual([
      { value: 1, unit: "시간" },
      { value: 10, unit: "분" },
    ]);
  });

  it("분이 0으로 떨어지면 시간만 돌려준다", () => {
    expect(getDurationParts(60)).toEqual([{ value: 1, unit: "시간" }]);
    expect(getDurationParts(120)).toEqual([{ value: 2, unit: "시간" }]);
  });

  it("0분은 분으로 돌려준다", () => {
    expect(getDurationParts(0)).toEqual([{ value: 0, unit: "분" }]);
  });
});

describe("formatDuration", () => {
  it("나눈 숫자와 단위를 이어 붙인 글자와 같다", () => {
    expect(formatDuration(27)).toBe("27분");
    expect(formatDuration(70)).toBe("1시간 10분");
    expect(formatDuration(60)).toBe("1시간");
    expect(formatDuration(0)).toBe("0분");
  });
});
