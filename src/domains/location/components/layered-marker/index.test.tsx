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

vi.mock("@/assets/icons/logo-pin.svg?react", () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-icon="logo-pin" className={className} />
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
    expect(labelLayer?.inner).toMatch(/data-icon="logo-pin"[^>]*invisible/);
    expect(iconLayer?.inner).toContain('data-icon="logo-pin"');
    expect(iconLayer?.inner).not.toContain("invisible");
  });

  it("빈 아이콘 자리가 아래 핀을 막지 않게 두 층 모두 눌림을 받지 않는다", () => {
    expect(layers.map((layer) => layer.interactive)).toEqual([
      "false",
      "false",
    ]);
  });
});
