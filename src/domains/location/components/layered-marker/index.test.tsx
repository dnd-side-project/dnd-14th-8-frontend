import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LayeredMarker, MARKER_ICON_Z_INDEX } from ".";

vi.mock("@/domains/location/components/map-marker", () => ({
  MapMarker: ({
    zIndex,
    interactive,
    children,
  }: {
    zIndex: number;
    interactive?: boolean;
    children: ReactNode;
  }) => (
    <section data-z={zIndex} data-interactive={String(interactive)}>
      {children}
    </section>
  ),
}));

vi.mock("@/assets/map-pins/midpoint-pin.svg?react", () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-icon="midpoint-pin" className={className} />
  ),
}));

/** 지도에 올린 층을 쌓는 순서와 함께 꺼낸다. */
function layersOf(markup: string) {
  return [
    ...markup.matchAll(
      /<section data-z="(\d+)" data-interactive="(\w+)">(.*?)<\/section>/g,
    ),
  ].map(([, zIndex, interactive, inner]) => ({
    zIndex: Number(zIndex),
    interactive,
    inner,
  }));
}

describe("LayeredMarker", () => {
  const markup = renderToStaticMarkup(
    <LayeredMarker
      latitude={37.5}
      longitude={127}
      zIndex={120}
      text="어린이대공원역"
      variant="blue"
      size="sm"
    />,
  );
  const layers = layersOf(markup);
  const labelLayer = layers.find((layer) =>
    layer.inner.includes("어린이대공원역"),
  );
  const iconLayer = layers.find(
    (layer) => !layer.inner.includes("어린이대공원역"),
  );

  it("이름표와 아이콘을 따로 올리고 이름은 한 번만 쓴다", () => {
    expect(layers).toHaveLength(2);
    expect(markup.match(/어린이대공원역/g)).toHaveLength(1);
  });

  it("아이콘은 사람 이름표(90)보다 아래에, 이름표는 받은 순서에 쌓는다", () => {
    expect(labelLayer?.zIndex).toBe(120);
    expect(iconLayer?.zIndex).toBe(MARKER_ICON_Z_INDEX);
    expect(MARKER_ICON_Z_INDEX).toBeLessThan(90);
  });

  it("이름표 층은 아이콘 자리를 비워 두고, 아이콘 층만 아이콘을 보여 준다", () => {
    expect(labelLayer?.inner).toMatch(/data-icon="midpoint-pin"[^>]*invisible/);
    expect(iconLayer?.inner).toContain('data-icon="midpoint-pin"');
    expect(iconLayer?.inner).not.toContain("invisible");
  });

  it("빈 아이콘 자리가 아래 핀을 막지 않게 두 층 모두 눌림을 받지 않는다", () => {
    expect(layers.map((layer) => layer.interactive)).toEqual([
      "false",
      "false",
    ]);
  });

  it("이름표를 보일 때는 이름을 화면 낭독기용 글자로 따로 두지 않는다", () => {
    expect(markup).not.toContain("sr-only");
  });
});

describe("LayeredMarker hideLabel", () => {
  const markup = renderToStaticMarkup(
    <LayeredMarker
      latitude={37.5}
      longitude={127}
      zIndex={120}
      text="어린이대공원역"
      variant="blue"
      size="sm"
      hideLabel
    />,
  );
  const layers = layersOf(markup);
  const iconLayer = layers.find(
    (layer) => layer.zIndex === MARKER_ICON_Z_INDEX,
  );
  const labelLayer = layers.find((layer) => layer.zIndex === 120);

  it("이름표 층은 지도에 남기고 비우기만 한다", () => {
    expect(layers).toHaveLength(2);
    expect(labelLayer?.inner).toBe("");
  });

  it("아이콘은 그대로 보이고, 이름은 화면 낭독기용 글자로 한 번만 남긴다", () => {
    expect(iconLayer?.inner).toContain('data-icon="midpoint-pin"');
    expect(iconLayer?.inner).not.toContain("invisible");
    expect(iconLayer?.inner).toContain(
      '<span class="sr-only">어린이대공원역</span>',
    );
    expect(markup.match(/어린이대공원역/g)).toHaveLength(1);
  });
});
