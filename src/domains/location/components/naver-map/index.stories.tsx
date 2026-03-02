import type { Meta, StoryObj } from "@storybook/react";

/**
 * NaverMap은 네이버 맵 SDK(`naver.maps.Map`)를 래핑하는 컴포넌트입니다.
 * SDK 스크립트가 로드된 환경에서만 동작하므로 Storybook에서는 구조만 표시합니다.
 */
const meta = {
  title: "domains/location/NaverMap",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Info: Story = {
  render: () => (
    <div className="w-[375px] px-5 py-8">
      <div className="rounded-lg border border-k-100 bg-k-10 px-4 py-6 text-center">
        <p className="text-k-700 text-t2">NaverMap</p>
        <p className="mt-2 text-b4 text-k-500">
          <code className="text-primary-main">naver.maps.Map</code> SDK
          래퍼입니다. Storybook에서는 네이버 맵 스크립트가 없어 렌더링이
          불가합니다.
        </p>
        <p className="mt-3 text-b5 text-k-400">Props:</p>
        <ul className="mt-1 space-y-1 text-left text-b5 text-k-500">
          <li>
            <code>center</code> — {"{ latitude, longitude }"}
          </li>
          <li>
            <code>zoom</code> — 줌 레벨 (기본 13)
          </li>
          <li>
            <code>onMapReady</code> — 지도 인스턴스 콜백
          </li>
          <li>
            <code>children</code> — MapMarker 등 오버레이
          </li>
        </ul>
      </div>
    </div>
  ),
};
