import { describe, expect, it } from "vitest";
import {
  getSubwayLineColor,
  SUBWAY_LINE_COLORS,
} from "@/domains/location/constants/subway-line-colors";

// 백엔드 stations의 노선 이름 24가지(V9 기준, dnd-14th-8-backend#187).
const BACKEND_LINES = [
  "1호선",
  "2호선",
  "3호선",
  "4호선",
  "5호선",
  "6호선",
  "7호선",
  "8호선",
  "9호선",
  "경의중앙선",
  "수인분당선",
  "신분당선",
  "인천1호선",
  "인천2호선",
  "공항철도",
  "우이신설선",
  "신림선",
  "의정부경전철",
  "에버라인",
  "김포골드라인",
  "경춘선",
  "경강선",
  "서해선",
  "GTX-A",
];

// 배지 글자 색 토큰의 값. 흰 글자는 fg.neutral.faintest(gray.0), 진한 글자는 fg.neutral.stronger(gray.900)다.
const LIGHT_TEXT = "#FFFFFF";
const DARK_TEXT = "#171A1F";

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((i) => {
    const value = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** WCAG 2 대비. */
function contrast(a: string, b: string) {
  const [high, low] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (high + 0.05) / (low + 0.05);
}

describe("SUBWAY_LINE_COLORS", () => {
  it("백엔드가 주는 노선 이름 24가지에 모두 색이 있다", () => {
    expect(Object.keys(SUBWAY_LINE_COLORS).sort()).toEqual(
      [...BACKEND_LINES].sort(),
    );
  });

  it("글자 색은 흰 글자와 진한 글자 가운데 바탕과의 대비가 더 큰 쪽이다", () => {
    for (const [line, { background, text }] of Object.entries(
      SUBWAY_LINE_COLORS,
    )) {
      const light = contrast(background, LIGHT_TEXT);
      const dark = contrast(background, DARK_TEXT);
      expect(text, line).toBe(light >= dark ? "light" : "dark");
    }
  });

  it("대비가 4.5:1에 못 미치는 노선은 7호선, 김포골드라인, 신림선뿐이다", () => {
    const belowAA = Object.entries(SUBWAY_LINE_COLORS)
      .filter(
        ([, { background, text }]) =>
          contrast(background, text === "light" ? LIGHT_TEXT : DARK_TEXT) < 4.5,
      )
      .map(([line]) => line)
      .sort();

    expect(belowAA).toEqual(["7호선", "김포골드라인", "신림선"].sort());
  });

  it("표에 없는 노선은 undefined다", () => {
    expect(getSubwayLineColor("2호선")).toEqual({
      background: "#00A23F",
      text: "dark",
    });
    expect(getSubwayLineColor("위례선")).toBeUndefined();
  });
});
