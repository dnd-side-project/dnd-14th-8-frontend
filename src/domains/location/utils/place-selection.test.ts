import { describe, expect, it } from "vitest";
import { getPlaceSelection } from "@/domains/location/utils/place-selection";

const seodaemun = {
  title: "서대문역 5호선",
  roadAddress: "서울 종로구 통일로 지하 126",
  address: "서울 종로구 평동 210",
  x: "126.96663755850754",
  y: "37.56575193662503",
};

describe("getPlaceSelection", () => {
  it("장소 이름은 첫 줄로, 고를 때 본 도로명 주소는 둘째 줄로 저장한다", () => {
    expect(getPlaceSelection(seodaemun)).toEqual({
      departureLocation: "서대문역 5호선",
      departureAddress: "서울 종로구 통일로 지하 126",
    });
  });

  it("도로명 주소가 없으면 지번 주소를 둘째 줄로 저장한다", () => {
    expect(
      getPlaceSelection({ ...seodaemun, roadAddress: "" }).departureAddress,
    ).toBe("서울 종로구 평동 210");
  });
});
