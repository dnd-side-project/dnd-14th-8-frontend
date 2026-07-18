import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { LandingGuideSection } from "@/domains/meeting/components/landing-guide-section";

const meta = {
  title: "meeting/LandingGuideSection",
  component: LandingGuideSection,
  decorators: [
    (Story) => (
      <div className="w-[375px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LandingGuideSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("모여락 이용방법")).toBeVisible();
    await expect(canvas.getByText("일정 조율하기")).toBeVisible();
    await expect(canvas.getByText("중간 지점 찾기")).toBeVisible();
    await expect(canvas.getByText("가능한 날짜 투표")).toBeVisible();
    await expect(canvas.getByText("중간지점 역 추천 받기")).toBeVisible();
  },
};
