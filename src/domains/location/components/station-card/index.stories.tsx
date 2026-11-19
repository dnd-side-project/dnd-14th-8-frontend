import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { StationCard } from ".";

const meta = {
  title: "domains/location/StationCard",
  component: StationCard,
  parameters: { layout: "centered" },
  args: { onClick: fn() },
} satisfies Meta<typeof StationCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rank: 1,
    name: "을지로3가역",
    lines: ["2호선", "3호선"],
    durationMinutes: 27,
  },
};

export const Selected: Story = {
  args: {
    rank: 1,
    name: "을지로3가역",
    lines: ["2호선", "3호선"],
    durationMinutes: 27,
    selected: true,
  },
};

export const OneLine: Story = {
  args: { rank: 1, name: "대화역", lines: ["3호선"], durationMinutes: 41 },
};

export const OverAnHour: Story = {
  args: {
    rank: 2,
    name: "충무로역",
    lines: ["3호선", "4호선"],
    durationMinutes: 70,
  },
};

// 노선 셋이 158px를 넘어 배지가 두 줄이 된다.
export const TwoBadgeRows: Story = {
  args: {
    rank: 2,
    name: "홍대입구역",
    lines: ["2호선", "경의중앙선", "공항철도"],
    durationMinutes: 35,
  },
};

// 노선이 가장 많은 역(5개). 배지가 세 줄이 된다.
export const ThreeBadgeRows: Story = {
  args: {
    rank: 3,
    name: "서울역",
    lines: ["1호선", "4호선", "경의중앙선", "공항철도", "GTX-A"],
    durationMinutes: 32,
  },
};

// 이름이 이름 칸 132px를 넘는 유일한 역이라 카드가 192px보다 넓어진다. 배지는 그 폭 안에서 줄을 바꾼다.
export const LongName: Story = {
  args: {
    rank: 4,
    name: "동대문역사문화공원역",
    lines: ["2호선", "4호선", "5호선"],
    durationMinutes: 30,
  },
};

// 노선마다 이름이 다른 환승역은 백엔드가 합친 이름으로 준다.
export const MergedName: Story = {
  args: {
    rank: 2,
    name: "총신대입구(이수)역",
    lines: ["4호선", "7호선"],
    durationMinutes: 26,
  },
};

// 색 표에 없는 노선은 회색 배지다.
export const UnknownLine: Story = {
  args: {
    rank: 1,
    name: "마천역",
    lines: ["5호선", "위례선"],
    durationMinutes: 33,
  },
};

// 가로로 넘기는 줄. 결과 화면의 카드 줄과 같은 클래스다.
export const Row: Story = {
  args: { rank: 1, name: "을지로3가역", durationMinutes: 27 },
  render: () => (
    <div className="w-[375px] px-5 py-3">
      <div className="scrollbar-hide -mx-5 -my-1 flex gap-3 overflow-x-auto px-5 py-1">
        <StationCard
          rank={1}
          name="을지로3가역"
          lines={["2호선", "3호선"]}
          durationMinutes={27}
          selected
        />
        <StationCard
          rank={2}
          name="충무로역"
          lines={["3호선", "4호선"]}
          durationMinutes={28}
        />
        <StationCard
          rank={3}
          name="종로3가역"
          lines={["1호선", "3호선", "5호선"]}
          durationMinutes={29}
        />
      </div>
    </div>
  ),
};

// 배지가 여러 줄인 카드가 끼면 카드 줄은 가장 높은 카드에 높이를 맞추고, 시간 줄은 모든 카드에서 아래에 붙는다.
export const RowWithTallCard: Story = {
  args: { rank: 1, name: "회현역", durationMinutes: 31 },
  render: () => (
    <div className="w-[375px] px-5 py-3">
      <div className="scrollbar-hide -mx-5 -my-1 flex gap-3 overflow-x-auto px-5 py-1">
        <StationCard
          rank={1}
          name="회현역"
          lines={["4호선"]}
          durationMinutes={31}
          selected
        />
        <StationCard
          rank={2}
          name="서울역"
          lines={["1호선", "4호선", "경의중앙선", "공항철도", "GTX-A"]}
          durationMinutes={32}
        />
        <StationCard
          rank={3}
          name="숙대입구역"
          lines={["4호선"]}
          durationMinutes={34}
        />
      </div>
    </div>
  ),
};
