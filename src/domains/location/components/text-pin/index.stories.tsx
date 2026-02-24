import type { Meta, StoryObj } from "@storybook/react";
import { TextPin } from "@/domains/location/components/text-pin";

const meta: Meta = {
  title: "domains/location/TextPin",
};

export default meta;

export const Blue: StoryObj = {
  render: () => (
    <div className="flex gap-4 p-8">
      <TextPin variant="blue" text="김포공항역" />
      <TextPin variant="blue" text="합정역" />
      <TextPin variant="blue" text="어린이대공원역" />
    </div>
  ),
};

export const Black: StoryObj = {
  render: () => (
    <div className="flex gap-4 p-8">
      <TextPin variant="black" text="김지원" />
      <TextPin variant="black" text="이지은" />
      <TextPin variant="black" text="황민현" />
    </div>
  ),
};
