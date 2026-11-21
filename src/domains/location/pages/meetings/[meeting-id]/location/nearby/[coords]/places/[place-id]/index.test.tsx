// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { PlaceDetailPage } from "@/domains/location/pages/meetings/[meeting-id]/location/nearby/[coords]/places/[place-id]";

/** 넘어간 결과 화면의 주소와 넘어간 방식(PUSH, REPLACE)을 글자로 보여 준다. */
function LocationProbe() {
  const location = useLocation();
  const navigationType = useNavigationType();
  return (
    <>
      <p data-testid="location">{location.pathname + location.search}</p>
      <p data-testid="navigation-type">{navigationType}</p>
    </>
  );
}

function renderAt(entry: string) {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route
          path="/meetings/:meetingId/location/nearby/:coords/places/:placeId"
          element={<PlaceDetailPage />}
        />
        <Route
          path="/meetings/:meetingId/location/stations"
          element={<LocationProbe />}
        />
      </Routes>
    </MemoryRouter>,
  );

  return {
    url: new URL(
      screen.getByTestId("location").textContent ?? "",
      "https://moyeorak.site",
    ),
    navigationType: screen.getByTestId("navigation-type").textContent,
  };
}

afterEach(() => {
  cleanup();
});

describe("PlaceDetailPage(옛 장소 상세 주소)", () => {
  it("결과 화면에서 그 장소를 고른 주소로 바꿔 넘기고 역과 분류를 유지한다", () => {
    const { url, navigationType } = renderAt(
      `/meetings/m1/location/nearby/37.5663x126.9918/places/9001?station_id=101&category=${encodeURIComponent("스터디룸")}`,
    );

    expect(navigationType).toBe("REPLACE");
    expect(url.pathname).toBe("/meetings/m1/location/stations");
    expect(url.searchParams.get("station_id")).toBe("101");
    expect(url.searchParams.get("tab")).toBe("nearby");
    expect(url.searchParams.get("category")).toBe("스터디룸");
    expect(url.searchParams.get("place_id")).toBe("9001");
  });

  it("옛 분류 이름(음식점)은 새 이름(식당)으로 넘긴다", () => {
    const { url } = renderAt(
      `/meetings/m1/location/nearby/37.5663x126.9918/places/9200?station_id=101&category=${encodeURIComponent("음식점")}`,
    );

    expect(url.searchParams.get("category")).toBe("식당");
    expect(url.searchParams.get("place_id")).toBe("9200");
  });

  it("좌표를 읽을 수 없어도 좌표는 버리므로 그대로 넘긴다", () => {
    const { url } = renderAt(
      "/meetings/m1/location/nearby/not-coords/places/9000?station_id=101",
    );

    expect(url.pathname).toBe("/meetings/m1/location/stations");
    expect(url.searchParams.get("station_id")).toBe("101");
    expect(url.searchParams.get("place_id")).toBe("9000");
  });
});
