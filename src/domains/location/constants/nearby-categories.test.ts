import { describe, expect, it } from "vitest";
import {
  NEARBY_CATEGORIES,
  NEARBY_FACILITY_TYPE,
  NEARBY_SEARCH_RULES,
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
