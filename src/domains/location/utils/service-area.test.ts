import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import {
  isOutOfServiceAreaError,
  isWithinServiceArea,
} from "@/domains/location/utils/service-area";

function createAxiosError(code: string) {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, {
    config,
    data: { code },
    headers: {},
    status: 400,
    statusText: "Bad Request",
  });
}

describe("isWithinServiceArea", () => {
  it("수도권 좌표(서울시청)는 서비스 지역이다", () => {
    expect(isWithinServiceArea(37.5665, 126.978)).toBe(true);
  });

  it("수도권 전철망 경계 좌표(신창역, 춘천역)는 서비스 지역이다", () => {
    expect(isWithinServiceArea(36.7695, 127.1046)).toBe(true);
    expect(isWithinServiceArea(37.8853, 127.7173)).toBe(true);
  });

  it("독도는 서비스 지역이 아니다", () => {
    expect(isWithinServiceArea(37.2426, 131.8597)).toBe(false);
  });

  it("제주는 서비스 지역이 아니다", () => {
    expect(isWithinServiceArea(33.4996, 126.5312)).toBe(false);
  });

  it("부산은 서비스 지역이 아니다", () => {
    expect(isWithinServiceArea(35.1796, 129.0756)).toBe(false);
  });

  it("숫자가 아닌 값(NaN)은 서비스 지역이 아니다", () => {
    expect(isWithinServiceArea(Number.NaN, 126.978)).toBe(false);
  });
});

describe("isOutOfServiceAreaError", () => {
  it("E427 응답이면 true를 반환한다", () => {
    expect(isOutOfServiceAreaError(createAxiosError("E427"))).toBe(true);
  });

  it("다른 에러 코드면 false를 반환한다", () => {
    expect(isOutOfServiceAreaError(createAxiosError("E500"))).toBe(false);
  });

  it("Axios 에러가 아니면 false를 반환한다", () => {
    expect(isOutOfServiceAreaError(new Error("boom"))).toBe(false);
  });
});
