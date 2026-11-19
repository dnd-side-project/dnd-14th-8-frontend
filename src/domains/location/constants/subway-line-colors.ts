/** 노선 배지의 글자 색. light는 흰 글자(fg.neutral.faintest), dark는 진한 글자(fg.neutral.stronger)다. */
export type SubwayLineTextTone = "light" | "dark";

export interface SubwayLineColor {
  /** 노선 고유색(sRGB) */
  background: string;
  text: SubwayLineTextTone;
}

/**
 * 지하철 노선 배지 색(#261). 키는 백엔드가 주는 노선 이름(stations.line) 그대로다.
 *
 * - 바탕색: 서울시 "노선별 색상값"(2025-05, 서울 지하철 노선도 디자인 개발 페이지
 *   https://news.seoul.go.kr/culture/archives/522224)의 RGB 칸 값이다. 23개 노선이 있다.
 * - GTX-A는 서울시 자료에 없고 공식 색을 찾지 못해, 카카오맵이 보여 주는 색을 캡처에서 sRGB로 뽑았다(2026-11-19).
 * - 글자 색: 바탕과의 대비가 더 큰 쪽이다. 4.5:1에 못 미치는 노선은 7호선(4.48:1), 김포골드라인(4.41:1),
 *   신림선(4.26:1)이다. 값은 subway-line-colors.test.ts가 다시 계산해 확인한다.
 * - 디자인 시스템 토큰이 아니라 노선마다 정해진 데이터라 화면에서는 인라인 style로 쓴다(AGENTS.md 예외).
 */
export const SUBWAY_LINE_COLORS: Readonly<Record<string, SubwayLineColor>> = {
  "1호선": { background: "#004A85", text: "light" },
  "2호선": { background: "#00A23F", text: "dark" },
  "3호선": { background: "#ED6C00", text: "dark" },
  "4호선": { background: "#009BCE", text: "dark" },
  "5호선": { background: "#794698", text: "light" },
  "6호선": { background: "#7C4932", text: "light" },
  "7호선": { background: "#6E7E31", text: "light" },
  "8호선": { background: "#D11D70", text: "light" },
  "9호선": { background: "#A49D87", text: "dark" },
  경의중앙선: { background: "#6AC2B3", text: "dark" },
  수인분당선: { background: "#ECA300", text: "dark" },
  신분당선: { background: "#B81B30", text: "light" },
  인천1호선: { background: "#B4C7E7", text: "dark" },
  공항철도: { background: "#0079AC", text: "light" },
  우이신설선: { background: "#BACC50", text: "dark" },
  신림선: { background: "#5E7DBB", text: "dark" },
  의정부경전철: { background: "#F0831E", text: "dark" },
  에버라인: { background: "#44A436", text: "dark" },
  인천2호선: { background: "#F4A462", text: "dark" },
  김포골드라인: { background: "#957326", text: "light" },
  경춘선: { background: "#007A62", text: "light" },
  경강선: { background: "#0B318F", text: "light" },
  서해선: { background: "#5EAC41", text: "dark" },
  "GTX-A": { background: "#9A6192", text: "light" },
};

/** 표에 없는 노선(새로 생긴 노선 등)은 undefined다. 부르는 쪽에서 회색 배지로 보여 준다. */
export function getSubwayLineColor(line: string): SubwayLineColor | undefined {
  return SUBWAY_LINE_COLORS[line];
}
