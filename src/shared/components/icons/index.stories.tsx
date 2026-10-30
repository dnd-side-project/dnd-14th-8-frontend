import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from ".";

const SIZE_VARIANTS = [16, 20, 24, 28, 32, 48, 76];
const COLOR_VARIANTS = [
  { label: "fg.neutral.faintest", value: "var(--colors-fg-neutral-faintest)" },
  { label: "fg.neutral.subtle", value: "var(--colors-fg-neutral-subtle)" },
  { label: "fg.neutral.strong", value: "var(--colors-fg-neutral-strong)" },
  { label: "fg.neutral.default", value: "var(--colors-fg-neutral-default)" },
  { label: "fg.brand.default", value: "var(--colors-fg-brand-default)" },
  { label: "fg.positive.default", value: "var(--colors-fg-positive-default)" },
  { label: "fg.negative.default", value: "var(--colors-fg-negative-default)" },
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
  args: {
    iconName: "CalendarIcon",
    size: 20,
    color: "var(--colors-fg-neutral-strong)",
  },
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
            <span className="text-[11px] text-fg-neutral-default">
              {size}px
            </span>
          </div>
        ))}
      </div>
    );
  },
  args: { iconName: "TimeIcon", color: "var(--colors-fg-neutral-strong)" },
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
            <span className="text-center text-[10px] text-fg-neutral-default">
              {label}
            </span>
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
            className="flex flex-col items-center gap-2 rounded-lg border border-stroke-neutral-subtle bg-white p-2"
            key={iconName}
          >
            <Icon aria-hidden color={color} height={size} width={size} />
            <span className="textStyle_caption3 text-fg-neutral-default">
              {toLabel(iconName)}
            </span>
          </li>
        ))}
      </ul>
    );
  },
  args: { size: 20, color: "var(--colors-fg-neutral-strong)" },
  argTypes: {
    iconName: { table: { disable: true } },
  },
};
