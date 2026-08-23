import type { Meta, StoryObj } from "@storybook/react";
import { HomeLogoButton } from "@/shared/components/home-logo-button";

const meta = {
  title: "shared/HomeLogoButton",
  component: HomeLogoButton,
  parameters: { layout: "centered" },
} satisfies Meta<typeof HomeLogoButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 일정 메인: Hero와 같은 배경 위에 얹힌 모습 */
export const OnScheduleHero: Story = {
  render: (args) => (
    <div className="w-[375px] bg-p-50 px-4 pt-4 pb-6">
      <HomeLogoButton {...args} />
      <h1 className="mt-6 whitespace-pre-line text-h2 text-k-900">
        {"팀원들에게 링크를\n공유해보세요!"}
      </h1>
    </div>
  ),
};

/** 장소 메인: 지도 위에 떠 있고, 우상단 '주변 장소' 칩과 마주보는 모습 */
export const OnMap: Story = {
  render: (args) => (
    <div className="relative h-[240px] w-[375px] bg-k-100">
      <HomeLogoButton {...args} className="absolute top-4 left-4" />
      <span className="absolute top-4 right-4 inline-flex h-10 items-center rounded-full border border-primary-main/20 bg-k-5 px-3.5 text-b4 text-k-800 shadow-[0_2px_10px_rgba(0,0,0,0.18)]">
        주변 장소
      </span>
    </div>
  ),
};
