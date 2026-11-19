import type { Meta, StoryObj } from "@storybook/react";
import { DotPin } from "@/domains/location/components/dot-pin";
import { TextPin } from "@/domains/location/components/text-pin";

const meta: Meta = {
  title: "domains/location/DotPin",
};

export default meta;

// 흰 테두리가 보이도록 지도처럼 옅은 회색 위에 그린다.
export const All: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4 bg-fill-neutral-subtler p-8">
      <DotPin variant="black" text="모락" />
      <DotPin variant="blue" text="락이" />
    </div>
  ),
};

/** 결과 화면에서 처음 화면보다 축소하면 왼쪽 이름표가 오른쪽 점으로 바뀐다. */
export const ComparedWithTextPin: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6 bg-fill-neutral-subtler p-8">
      <div className="flex items-center gap-4">
        <TextPin variant="black" text="모락" />
        <DotPin variant="black" text="모락" />
      </div>
      <div className="flex items-center gap-4">
        <TextPin variant="blue" text="락이" />
        <DotPin variant="blue" text="락이" />
      </div>
    </div>
  ),
};
