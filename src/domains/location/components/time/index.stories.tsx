import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import DeparturePicker from "@/domains/location/components/time";

const meta: Meta<typeof DeparturePicker> = {
  title: "Components/DeparturePicker",
  component: DeparturePicker,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onChange: {
      description: "날짜 변경 시 호출되는 콜백 함수 (ISO-8601 문자열 반환)",
      table: {
        type: { summary: "(isoValue: string) => void" },
      },
    },
  },
  // onChange가 호출될 때 Storybook의 'Actions' 탭에 로그가 찍히도록 설정
  args: { onChange: fn() },
};

export default meta;
type Story = StoryObj<typeof DeparturePicker>;

/**
 * 실제 서버에 전달되는 값을 확인하는 인터랙션 테스트용입니다.
 */
export const InteractionTest: Story = {
  args: {
    onChange: (val) => console.log("Storybook 로그 (서버 전달값):", val),
  },
};
