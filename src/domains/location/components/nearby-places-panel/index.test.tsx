import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { NearbyPlace } from "@/domains/location/types/nearby-place";
import { NearbyPlacesPanel } from ".";

/** 태그를 지우고 화면 읽기 기능이 이어 읽는 글자만 남긴다. */
function textOf(markup: string) {
  return markup.replace(/<[^>]+>/g, "");
}

const PLACES: NearbyPlace[] = [
  {
    id: "9000",
    name: "모여 스터디룸",
    address: "서울 중구 을지로 100",
    distanceMeters: 120,
    latitude: 37.5671,
    longitude: 126.9912,
    placeUrl: "https://place.map.kakao.com/9000",
  },
  {
    id: "9001",
    name: "을지 스터디카페",
    address: "서울 중구 을지로 101",
    distanceMeters: 260,
    latitude: 37.5648,
    longitude: 126.993,
    placeUrl: "https://place.map.kakao.com/9001",
  },
];

function render(props: Partial<Parameters<typeof NearbyPlacesPanel>[0]>) {
  return renderToStaticMarkup(
    <NearbyPlacesPanel
      category="스터디룸"
      onCategoryChange={() => undefined}
      foodCondition="nearest"
      onFoodConditionChange={() => undefined}
      places={[]}
      stationName="을지로3가역"
      onPlaceClick={() => undefined}
      {...props}
    />,
  );
}

/** 칩(aria-pressed가 있는 버튼)마다 [글자, 눌림]을 돌려준다. */
function chipsOf(markup: string) {
  return [
    ...markup.matchAll(
      /<button[^>]*aria-pressed="(true|false)"[^>]*>(.*?)<\/button>/g,
    ),
  ].map(([, pressed, inner]) => [textOf(inner), pressed]);
}

describe("NearbyPlacesPanel", () => {
  it("분류 칩은 스터디룸, 회의실, 식당, 카페 순서이고 고른 칩만 눌려 있다", () => {
    const markup = render({ category: "카페" });

    expect(chipsOf(markup)).toEqual([
      ["스터디룸", "false"],
      ["회의실", "false"],
      ["식당", "false"],
      ["카페", "true"],
    ]);
  });

  it("식당이면 분류 칩 아래에 조건 스위치(가까운 순, 맛집, 단체)가 나오고 고른 조건만 눌려 있다(#273)", () => {
    const markup = render({ category: "식당", foodCondition: "popular" });

    expect(chipsOf(markup)).toEqual([
      ["스터디룸", "false"],
      ["회의실", "false"],
      ["식당", "true"],
      ["카페", "false"],
      ["가까운 순", "false"],
      ["맛집", "true"],
      ["단체", "false"],
    ]);
  });

  it("고른 조건은 고른 분류 칩과 다른 모양으로 그린다(분류는 꽉 찬 파랑 칩, 조건은 흰 칸)", () => {
    const markup = render({ category: "식당", foodCondition: "nearest" });
    const pressedClasses = [
      ...markup.matchAll(
        /<button[^>]*class="([^"]*)"[^>]*aria-pressed="true"/g,
      ),
      ...markup.matchAll(
        /<button[^>]*aria-pressed="true"[^>]*class="([^"]*)"/g,
      ),
    ].map(([, className]) => className);

    expect(pressedClasses).toHaveLength(2);
    expect(pressedClasses[0]).not.toBe(pressedClasses[1]);
  });

  it("식당이 아니면 조건 스위치가 없다", () => {
    for (const category of ["스터디룸", "회의실", "카페"] as const) {
      const text = textOf(render({ category }));

      expect(text).not.toContain("가까운 순");
      expect(text).not.toContain("맛집");
    }
  });

  it("칩에는 아이콘이 없다", () => {
    const markup = render({});

    expect(markup).not.toContain("<svg");
  });

  it("장소마다 카드를 이름, 주소, 역에서의 거리로 보여 준다", () => {
    const markup = render({ places: PLACES });
    const text = textOf(markup);

    expect(text).toContain(
      "모여 스터디룸서울 중구 을지로 100을지로3가역에서 120m",
    );
    expect(text).toContain(
      "을지 스터디카페서울 중구 을지로 101을지로3가역에서 260m",
    );
    // 칩 4개와 카드 2개
    expect(markup.match(/<button/g)).toHaveLength(6);
  });

  it("카드마다 카카오 장소 ID를 data-place-id로 달아 포커스를 돌려줄 수 있게 한다", () => {
    const markup = render({ places: PLACES });

    expect(markup).toMatch(
      /<button[^>]*data-place-id="9000"[^>]*>.*?모여 스터디룸/,
    );
    expect(markup).toMatch(
      /<button[^>]*data-place-id="9001"[^>]*>.*?을지 스터디카페/,
    );
  });

  it("장소가 없으면 칩만 보여 주고 카드는 그리지 않는다", () => {
    const markup = render({ places: [] });

    expect(markup.match(/<button/g)).toHaveLength(4);
  });

  it("새 결과를 받는 동안(updating)은 카드 목록을 흐리게 두고 누르거나 키보드로 옮겨 가지 못하게 한다(#275)", () => {
    const list = (markup: string) =>
      markup.match(/<div[^>]*aria-busy="(true|false)"[^>]*>/)?.[0] ?? "";

    const updating = list(render({ places: PLACES, updating: true }));
    expect(updating).toContain('aria-busy="true"');
    expect(updating).toContain("inert");
    expect(updating).toContain("opacity-40");

    const settled = list(render({ places: PLACES }));
    expect(settled).toContain('aria-busy="false"');
    expect(settled).not.toContain("inert");
    expect(settled).not.toContain("opacity-40");
  });
});
