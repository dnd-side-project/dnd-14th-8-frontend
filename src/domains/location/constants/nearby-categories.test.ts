import { describe, expect, it } from "vitest";
import {
  FOOD_CONDITION_LABEL,
  FOOD_CONDITIONS,
  FOOD_SEARCH_RULES,
  getNearbySearchRule,
  NEARBY_CATEGORIES,
  NEARBY_FACILITY_TYPE,
  NEARBY_SEARCH_RULES,
  parseFoodCondition,
  parseNearbyCategory,
} from "@/domains/location/constants/nearby-categories";

describe("parseNearbyCategory", () => {
  it("새 분류 이름은 그대로 읽는다", () => {
    for (const category of NEARBY_CATEGORIES) {
      expect(parseNearbyCategory(category)).toBe(category);
    }
  });

  it("이미 공유된 링크의 옛 이름은 새 이름으로 읽는다", () => {
    expect(parseNearbyCategory("스터디카페")).toBe("스터디룸");
    expect(parseNearbyCategory("음식점")).toBe("식당");
  });

  it("값이 없거나 모르는 값이면 첫 분류(스터디룸)로 연다", () => {
    expect(parseNearbyCategory(null)).toBe("스터디룸");
    expect(parseNearbyCategory("")).toBe("스터디룸");
    expect(parseNearbyCategory("술집")).toBe("스터디룸");
  });

  it("객체가 물려받은 속성 이름도 모르는 값으로 보고 첫 분류로 연다", () => {
    expect(parseNearbyCategory("toString")).toBe("스터디룸");
    expect(parseNearbyCategory("constructor")).toBe("스터디룸");
    expect(parseNearbyCategory("__proto__")).toBe("스터디룸");
  });
});

describe("NEARBY_SEARCH_RULES", () => {
  it("분류마다 키워드나 업종 코드 중 하나만 있다", () => {
    for (const category of NEARBY_CATEGORIES) {
      const rule = NEARBY_SEARCH_RULES[category];
      expect(Boolean(rule.keyword) !== Boolean(rule.categoryGroupCode)).toBe(
        true,
      );
    }
  });

  it("식당과 카페는 업종 검색이다", () => {
    expect(NEARBY_SEARCH_RULES.식당.categoryGroupCode).toBe("FD6");
    expect(NEARBY_SEARCH_RULES.카페.categoryGroupCode).toBe("CE7");
  });
});

describe("NEARBY_FACILITY_TYPE", () => {
  it("분류마다 자기 아이콘을 쓴다", () => {
    expect(NEARBY_FACILITY_TYPE).toEqual({
      스터디룸: "book",
      회의실: "meetingroom",
      식당: "restaurant",
      카페: "cafe",
    });
  });
});

describe("식당 조건(#273)", () => {
  it("조건은 가까운 순, 맛집, 단체 순서이고 주소에는 영어 값을 쓴다", () => {
    expect(FOOD_CONDITIONS).toEqual(["nearest", "popular", "group"]);
    expect(
      FOOD_CONDITIONS.map((condition) => FOOD_CONDITION_LABEL[condition]),
    ).toEqual(["가까운 순", "맛집", "단체"]);
  });

  it("주소의 condition 값이 없거나 모르는 값이면 가까운 순으로 읽는다", () => {
    expect(parseFoodCondition("popular")).toBe("popular");
    expect(parseFoodCondition("group")).toBe("group");
    expect(parseFoodCondition(null)).toBe("nearest");
    expect(parseFoodCondition("")).toBe("nearest");
    expect(parseFoodCondition("맛집")).toBe("nearest");
    expect(parseFoodCondition("toString")).toBe("nearest");
  });

  it("맛집과 단체는 음식점 업종 안의 키워드 검색, 정확도순이다. 가까운 순은 #269 식당 규칙 그대로다", () => {
    expect(FOOD_SEARCH_RULES.nearest).toEqual(NEARBY_SEARCH_RULES.식당);
    expect(FOOD_SEARCH_RULES.popular).toEqual({
      keyword: "맛집",
      categoryGroupCode: "FD6",
      sort: "accuracy",
    });
    expect(FOOD_SEARCH_RULES.group).toEqual({
      keyword: "단체모임",
      categoryGroupCode: "FD6",
      sort: "accuracy",
    });
  });

  it("검색 규칙은 식당일 때만 조건을 따르고, 다른 분류는 조건과 관계없다", () => {
    expect(getNearbySearchRule("식당", "group")).toBe(FOOD_SEARCH_RULES.group);
    expect(getNearbySearchRule("식당")).toBe(FOOD_SEARCH_RULES.nearest);
    expect(getNearbySearchRule("카페", "popular")).toBe(
      NEARBY_SEARCH_RULES.카페,
    );
    expect(getNearbySearchRule("스터디룸", "group")).toBe(
      NEARBY_SEARCH_RULES.스터디룸,
    );
  });
});
