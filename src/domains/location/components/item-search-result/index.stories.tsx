import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ItemSearchResult } from ".";

const meta = {
  title: "domains/location/ItemSearchResult",
  component: ItemSearchResult,
  decorators: [
    (Story) => (
      <div className="w-[375px]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  args: { onClick: fn() },
} satisfies Meta<typeof ItemSearchResult>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    highlight: "강남",
    text: "강남역 2호선",
    description: "서울시 강남구 강남대로 396",
  },
};

export const Hover: Story = {
  args: {
    highlight: "강남",
    text: "강남역 2호선",
    description: "서울시 강남구 강남대로 396",
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const Active: Story = {
  args: {
    highlight: "강남",
    text: "강남역 2호선",
    description: "서울시 강남구 강남대로 396",
  },
  parameters: {
    pseudo: { active: true },
  },
};

export const NoHighlight: Story = {
  args: {
    text: "서울역",
    description: "서울시 중구 통일로 1",
  },
};

// 주소 검색 결과처럼 장소 이름 없이 주소 한 줄만 보일 때
export const WithoutDescription: Story = {
  args: {
    highlight: "연희동 123-4",
    text: "서울 서대문구 연희동 123-4",
  },
};

export const Showcase: Story = {
  args: {
    highlight: "강남",
    text: "강남역 2호선",
    description: "서울시 강남구 강남대로 396",
  },
  render: () => (
    <div className="flex flex-col">
      <ItemSearchResult
        highlight="강남"
        text="강남역 2호선"
        description="서울시 강남구 강남대로 396"
      />
      <ItemSearchResult
        id="item-search-result-hover"
        highlight="강남"
        text="강남구청역"
        description="서울시 강남구 학동로 426"
      />
      <ItemSearchResult
        id="item-search-result-active"
        highlight="강남"
        text="강남역 역삼동"
        description="서울시 강남구 역삼동 일원"
      />
    </div>
  ),
  parameters: {
    pseudo: {
      hover: "#item-search-result-hover",
      active: "#item-search-result-active",
    },
  },
};
