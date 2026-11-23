// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { type ReactNode, useLayoutEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MapMarker } from ".";

const fakeMap = vi.hoisted(() => ({}));

vi.mock("@/domains/location/components/naver-map", () => ({
  useNaverMap: () => fakeMap,
}));

/** SDK OverlayView 대신 쓰는 것. setMap에서 SDK처럼 onAdd와 draw를 부른다. */
class FakeOverlayView {
  static last: FakeOverlayView | null = null;
  pane = document.createElement("div");
  onAdd = () => {};
  draw = () => {};
  onRemove = () => {};
  scale?: (ratio: number) => void;

  constructor() {
    FakeOverlayView.last = this;
  }

  getPanes() {
    return { overlayLayer: this.pane };
  }

  getProjection() {
    return { fromCoordToOffset: () => ({ x: 120, y: 340 }) };
  }

  setMap(map: unknown) {
    if (map) {
      this.onAdd();
      this.draw();
    } else {
      this.onRemove();
    }
  }
}

function renderMarker(anchor?: "bottom" | "center") {
  render(
    <MapMarker latitude={37.5} longitude={127} anchor={anchor}>
      <span>핀</span>
    </MapMarker>,
  );
  const overlay = FakeOverlayView.last;
  const el = overlay?.pane.firstElementChild;
  if (!overlay || !(el instanceof HTMLElement)) throw new Error("핀 상자 없음");
  return { overlay, el };
}

beforeEach(() => {
  (window as unknown as { naver: unknown }).naver = {
    maps: { OverlayView: FakeOverlayView, LatLng: class {} },
  };
});

afterEach(() => {
  cleanup();
  FakeOverlayView.last = null;
  delete (window as unknown as { naver?: unknown }).naver;
});

describe("MapMarker 확대 효과", () => {
  it("SDK가 확대 중에 scale(비율)을 부르면 반대 비율을 걸어 핀 크기를 그대로 둔다", () => {
    const { overlay, el } = renderMarker();

    expect(el.style.transform).toBe("translate(-50%, -100%)");

    overlay.scale?.(2);

    // 비율은 좌표 자리(왼쪽 위) 기준으로 걸고, 그다음에 아래 가운데를 좌표에 맞춘다.
    expect(el.style.transformOrigin).toBe("0 0");
    expect(el.style.transform).toBe("scale(0.5) translate(-50%, -100%)");
  });

  it("확대가 끝나 SDK가 draw를 다시 부르면 원래대로 돌아온다", () => {
    const { overlay, el } = renderMarker();

    overlay.scale?.(2);
    overlay.draw();

    expect(el.style.transform).toBe("translate(-50%, -100%)");
    expect(el.style.left).toBe("120px");
    expect(el.style.top).toBe("340px");
  });

  it("한가운데를 맞추는 점도 맞추는 자리를 그대로 두고 비율만 건다", () => {
    const { overlay, el } = renderMarker("center");

    overlay.scale?.(4);

    expect(el.style.transform).toBe("scale(0.25) translate(-50%, -50%)");
  });
});

describe("MapMarker를 지도에 올리는 때(#275)", () => {
  it("화면을 그리기 전에 올려서, 핀이 통째로 바뀔 때 핀이 없는 프레임이 생기지 않는다", () => {
    let pinsBeforePaint = -1;

    // 부모의 useLayoutEffect는 자식의 useLayoutEffect 다음, 화면을 그리기 전에 돈다.
    function Screen({ children }: { children: ReactNode }) {
      useLayoutEffect(() => {
        pinsBeforePaint = FakeOverlayView.last?.pane.childElementCount ?? 0;
      }, []);
      return children;
    }

    render(
      <Screen>
        <MapMarker latitude={37.5} longitude={127}>
          <span>핀</span>
        </MapMarker>
      </Screen>,
    );

    expect(pinsBeforePaint).toBe(1);
    expect(FakeOverlayView.last?.pane.textContent).toBe("핀");
  });
});
