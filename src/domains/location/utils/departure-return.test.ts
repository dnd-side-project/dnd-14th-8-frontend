import { describe, expect, it } from "vitest";
import { getDepartureReturnPath } from "@/domains/location/utils/departure-return";

describe("getDepartureReturnPath", () => {
  it("기본값은 중간지점 결과 화면이다", () => {
    expect(getDepartureReturnPath({ meetingId: "42" })).toBe(
      "/meetings/42/location/stations",
    );
  });

  it("결과 화면에서 들어온 등록은 결과 화면으로 돌아간다", () => {
    expect(
      getDepartureReturnPath({ meetingId: "42", returnTo: "result" }),
    ).toBe("/meetings/42/location/stations");
  });

  it("관리 화면에서 들어온 등록은 관리 화면으로 돌아간다", () => {
    expect(
      getDepartureReturnPath({ meetingId: "42", returnTo: "manage" }),
    ).toBe("/meetings/42/location/votes");
  });

  it("알 수 없는 값이 넘어와도 결과 화면으로 보낸다", () => {
    expect(
      getDepartureReturnPath({ meetingId: "42", returnTo: "unknown" }),
    ).toBe("/meetings/42/location/stations");
  });

  it("state가 비어 넘어오지 않아도 결과 화면으로 보낸다", () => {
    expect(getDepartureReturnPath({ meetingId: "42", returnTo: null })).toBe(
      "/meetings/42/location/stations",
    );
  });
});
