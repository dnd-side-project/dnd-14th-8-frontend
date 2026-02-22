import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CarIcon, TrafficIcon } from "@/shared/components/icons";
import { Tab } from "@/shared/components/tab";

const meta: Meta<typeof Tab> = {
  title: "shared/Tab",
  component: Tab,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tab>;
export default meta;

type Story = StoryObj<typeof Tab>;

const mockTabs = [
  { id: "tab1", label: "text" },
  { id: "tab2", label: "text" },
];

const transportationTabs = [
  { id: "traffic", label: "대중교통", icon: TrafficIcon },
  { id: "car", label: "자동차", icon: CarIcon },
];

export const Default: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState(mockTabs[0].id);
    return (
      <Tab
        {...args}
        tabs={mockTabs}
        activeTabId={activeTab}
        onTabChange={(id) => {
          setActiveTab(id);
          args.onTabChange(id);
        }}
      />
    );
  },
  args: {
    onTabChange: (id) => console.log(`Tab changed to: ${id}`),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="space-y-2">
        <p className="text-b2 text-k-400"># Case 1: 2 Tabs (Default)</p>
        <Tab tabs={mockTabs} activeTabId="tab1" onTabChange={() => {}} />
      </section>

      <section className="space-y-2">
        <p className="text-b2 text-k-400">
          # Case 2: Transportation (With Icon)
        </p>

        <Tab
          tabs={transportationTabs}
          activeTabId="car"
          onTabChange={() => {}}
        />
      </section>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="w-[375px] py-3">
        <Story />
      </div>
    ),
  ],
};
