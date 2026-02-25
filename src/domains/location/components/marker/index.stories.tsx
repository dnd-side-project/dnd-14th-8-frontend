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
