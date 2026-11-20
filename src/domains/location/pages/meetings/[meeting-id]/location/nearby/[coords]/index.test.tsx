// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { NearbySearchPage } from "@/domains/location/pages/meetings/[meeting-id]/location/nearby/[coords]";

/** 넘어간 결과 화면의 주소를 글자로 보여 준다. */
function LocationProbe() {
  const location = useLocation();
  return <p data-testid="location">{location.pathname + location.search}</p>;
}

function renderAt(entry: string) {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route
          path="/meetings/:meetingId/location/nearby/:coords"
          element={<NearbySearchPage />}
        />
        <Route
          path="/meetings/:meetingId/location/stations"
          element={<LocationProbe />}
        />
      </Routes>
    </MemoryRouter>,
  );

  const url = new URL(
    screen.getByTestId("location").textContent ?? "",
    "https://moyeorak.site",
  );
  return url;
}

afterEach(() => {
  cleanup();
});

describe("NearbySearchPage(옛 주변 장소 목록 주소)", () => {
  it("결과 화면의 주변 살펴보기 탭으로 넘기고 역과 분류를 유지한다", () => {
    const url = renderAt(
      `/meetings/m1/location/nearby/37.5663x126.9918?station_id=101&category=${encodeURIComponent("음식점")}`,
    );

    expect(url.pathname).toBe("/meetings/m1/location/stations");
    expect(url.searchParams.get("station_id")).toBe("101");
    expect(url.searchParams.get("tab")).toBe("nearby");
    expect(url.searchParams.get("category")).toBe("식당");
  });

  it("쿼리 없이 들어오면 역 없이 첫 분류로 넘긴다", () => {
    const url = renderAt("/meetings/m1/location/nearby/37.5663x126.9918");

    expect(url.pathname).toBe("/meetings/m1/location/stations");
    expect(url.searchParams.has("station_id")).toBe(false);
    expect(url.searchParams.get("tab")).toBe("nearby");
    expect(url.searchParams.get("category")).toBe("스터디룸");
  });
});
