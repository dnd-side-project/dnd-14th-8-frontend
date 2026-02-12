import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tab } from ".";

const meta: Meta<typeof Tab> = {
  title: "shared/Tab",
  component: Tab,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="w-100 bg-gray-50 p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Tab>;

const mockTabs = [
  { id: "tab1", label: "text" },
  { id: "tab2", label: "text" },
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
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="w-100 bg-gray-50 p-4">
        <Story />
      </div>
    ),
  ],
};
