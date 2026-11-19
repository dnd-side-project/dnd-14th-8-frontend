import type { Meta, StoryObj } from "@storybook/react";
import { Marker } from "@/domains/location/components/marker";

const meta: Meta = {
  title: "domains/location/Marker",
};

export default meta;

export const All: StoryObj = {
  render: () => (
    <div className="flex items-end gap-4 p-8">
      <Marker size="sm" variant="blue" text="김포공항역" />
      <Marker size="md" variant="blue" text="김포공항역" />
    </div>
  ),
};

/** 지도에서는 LayeredMarker가 이름표와 아이콘을 나눠 그린다. 이름표만 그릴 때도 아이콘 자리는 남는다. */
export const Parts: StoryObj = {
  render: () => (
    <div className="flex items-end gap-4 p-8">
      <Marker size="sm" variant="blue" text="김포공항역" part="label" />
      <Marker size="sm" variant="blue" text="김포공항역" part="icon" />
    </div>
  ),
};
