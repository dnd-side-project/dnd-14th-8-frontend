import type { Meta, StoryObj } from "@storybook/react";
import { Empty1Character, Empty2Character } from "@/assets/characters";
import { PlaceholderContent } from "@/shared/components/placeholder-content";

const meta = {
  title: "shared/PlaceholderContent",
  component: PlaceholderContent,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto my-30 w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlaceholderContent>;

export default meta;

type Story = StoryObj<typeof PlaceholderContent>;

export const RequiredParticipantsSchedule: Story = {
  args: {
    graphic: <Empty1Character />,
    title: "두 명 이상의 일정이 필요해요..",
    description: "링크를 공유하거나 일정을 등록해 보세요.",
  },
};

export const RequiredParticipantsLocation: Story = {
  args: {
    graphic: <Empty1Character />,
    title: "두 명 이상의 출발지가 필요해요..",
    description: "링크를 공유하거나 직접 추가해 보세요.",
  },
};

export const NoOverlappingTime: Story = {
  args: {
    graphic: <Empty1Character />,
    title: "아직 겹치는 시간대가 없어요..",
    description: "시간 범위를 넓히거나 팀원들을 기다려 보세요.",
  },
};

export const NoAddressFound: Story = {
  args: {
    graphic: <Empty2Character />,
    title: "일치하는 주소가 없어요..",
    description: "검색한 지역을 다시 확인해 보세요.",
  },
};
