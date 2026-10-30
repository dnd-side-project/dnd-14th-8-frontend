import type { Meta, StoryObj } from "@storybook/react";

/**
 * MapMarker는 네이버 맵 OverlayView 기반으로 동작하므로
 * 지도 없이 독립 렌더링이 불가합니다.
 *
 * 대신 MapMarker에 들어가는 자식 컴포넌트들의 스토리를 참고하세요:
 * - `domains/location/Marker` (TextPin + LogoPinIcon)
 * - `domains/location/FacilityPin` (Default / Selected)
 * - `domains/location/TextPin` (말풍선)
 */
const meta = {
  title: "domains/location/MapMarker",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Info: Story = {
  render: () => (
    <div className="w-[375px] px-5 py-8">
      <div className="rounded-lg border border-stroke-neutral-subtle bg-fill-neutral-subtlest px-4 py-6 text-center">
        <p className="textStyle_title3 text-fg-neutral-default">MapMarker</p>
        <p className="textStyle_body4 mt-2 text-fg-neutral-subtle">
          네이버 맵 <code className="text-fg-brand-default">OverlayView</code>{" "}
          기반 컴포넌트로, 지도 인스턴스 없이 독립 렌더링이 불가합니다.
        </p>
        <p className="textStyle_body5 mt-2 text-fg-neutral-subtler">
          자식으로 들어가는 Marker, FacilityPin, TextPin 스토리를 참고하세요.
        </p>
      </div>
    </div>
  ),
};
