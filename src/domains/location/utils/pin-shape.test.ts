import { describe, expect, it } from "vitest";
import { getPinShape } from "@/domains/location/utils/pin-shape";

describe("getPinShape", () => {
  it("지도를 맞춘 직후보다 축소하면 점으로 그린다", () => {
    expect(getPinShape({ zoom: 13, fitZoom: 14 })).toBe("dot");
  });

  it("맞춘 직후와 같은 확대 단계면 이름표로 그린다", () => {
    expect(getPinShape({ zoom: 14, fitZoom: 14 })).toBe("label");
  });

  it("맞춘 직후보다 확대하면 이름표로 그린다", () => {
    expect(getPinShape({ zoom: 15, fitZoom: 14 })).toBe("label");
  });

  it("지도를 아직 맞추지 않아 기준이 없으면 이름표로 그린다", () => {
    expect(getPinShape({ zoom: 13, fitZoom: null })).toBe("label");
  });

  it("지금 확대 단계를 아직 모르면 이름표로 그린다", () => {
    expect(getPinShape({ zoom: null, fitZoom: 14 })).toBe("label");
  });
});
