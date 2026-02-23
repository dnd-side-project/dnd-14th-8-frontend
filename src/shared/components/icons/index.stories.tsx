import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from ".";

const SIZE_VARIANTS = [16, 20, 24, 28, 32];
const COLOR_VARIANTS = [
  { label: "k-5", value: "var(--color-k-5)" },
  { label: "k-500", value: "var(--color-k-500)" },
  { label: "k-800", value: "var(--color-k-800)" },
  { label: "k-700", value: "var(--color-k-700)" },
  { label: "p-400", value: "var(--color-p-400)" },
  { label: "action-green", value: "var(--color-action-green)" },
  { label: "action-red", value: "var(--color-action-red)" },
] as const;

interface IconPreviewProps {
  iconName: keyof typeof Icons;
  size: number;
  color: string;
}

function IconPreview({ iconName, size, color }: IconPreviewProps) {
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: Use dynamic import for storybook
  const Icon = Icons[iconName];
  return (
    <Icon aria-label={iconName} color={color} height={size} width={size} />
  );
}

const meta = {
  title: "shared/Icons",
  component: IconPreview,
  decorators: [
    (Story) => (
      <div className="flex w-[375px] justify-center px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  args: { iconName: "CalendarIcon", size: 20, color: "var(--color-k-800)" },
  argTypes: {
    iconName: { control: "select", options: Object.keys(Icons) },
    size: { control: { type: "range", min: 12, max: 48, step: 2 } },
    color: { control: "color" },
  },
} satisfies Meta<typeof IconPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SizeVariants: Story = {
  render: ({ color, iconName }) => {
    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: Use dynamic import for storybook
    const Icon = Icons[iconName];
    return (
      <div className="flex items-end gap-4">
        {SIZE_VARIANTS.map((size) => (
          <div className="flex flex-col items-center gap-1" key={size}>
            <Icon aria-hidden color={color} height={size} width={size} />
            <span className="text-[11px] text-k-700">{size}px</span>
          </div>
        ))}
      </div>
    );
  },
  args: { iconName: "TimeIcon", color: "var(--color-k-800)" },
  argTypes: {
    size: { table: { disable: true } },
  },
};

export const ColorVariants: Story = {
  render: ({ iconName, size }) => {
    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: Use dynamic import for storybook
    const Icon = Icons[iconName];
    return (
      <div className="flex flex-wrap items-end gap-4">
        {COLOR_VARIANTS.map(({ label, value }) => (
          <div
            className="flex w-[70px] flex-col items-center gap-1"
            key={label}
          >
            <Icon aria-hidden color={value} height={size} width={size} />
            <span className="text-center text-[10px] text-k-700">{label}</span>
          </div>
        ))}
      </div>
    );
  },
  args: { iconName: "CalendarIcon", size: 20 },
  argTypes: {
    color: { table: { disable: true } },
  },
};

export const AllIcons: Story = {
  render: ({ color, size }) => {
    const toLabel = (iconName: string) => iconName.replace(/(.*)Icon$/, "$1");

    return (
      <ul className="grid grid-cols-3 gap-3">
        {Object.entries(Icons).map(([iconName, Icon]) => (
          <li
            className="flex flex-col items-center gap-2 rounded-lg border border-k-100 bg-white p-2"
            key={iconName}
          >
            <Icon aria-hidden color={color} height={size} width={size} />
            <span className="text-c3 text-k-700">{toLabel(iconName)}</span>
          </li>
        ))}
      </ul>
    );
  },
  args: { size: 20, color: "var(--color-k-800)" },
  argTypes: {
    iconName: { table: { disable: true } },
  },
};
