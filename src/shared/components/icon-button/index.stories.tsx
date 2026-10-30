import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "@/shared/components/icon-button";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
} from "@/shared/components/icons";

const meta = {
  title: "shared/IconButton",
  component: IconButton,
  args: {
    "aria-label": "추가",
    icon: PlusIcon,
    size: "xl",
    background: "square",
    backgroundSize: "md",
    iconSize: "lg",
    variant: "primary",
  },
  argTypes: {
    icon: {
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] px-5 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PseudoStatesTest: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6">
      {/* Background Square Tests */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="mb-2 text-fg-neutral-subtle text-sm">Square Normal</p>
          <IconButton
            aria-label="아이콘 버튼"
            icon={PlusIcon}
            size="xl"
            background="square"
            backgroundSize="md"
            iconSize="lg"
            variant="primary"
          />
        </div>
        <div className="text-center">
          <p className="mb-2 text-fg-neutral-subtle text-sm">
            Square Manual Hover
          </p>
          <IconButton
            aria-label="아이콘 버튼"
            id="btn-square-manual-hover"
            icon={PlusIcon}
            size="xl"
            background="square"
            backgroundSize="md"
            iconSize="lg"
            variant="primary"
          />
        </div>
        <div className="text-center">
          <p className="mb-2 text-fg-neutral-subtle text-sm">Square Dark</p>
          <IconButton
            aria-label="아이콘 버튼"
            icon={PlusIcon}
            size="xl"
            background="square"
            backgroundSize="md"
            iconSize="lg"
            variant="dark"
          />
        </div>
      </div>

      {/* Background None Tests */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="mb-2 text-fg-neutral-subtle text-sm">None Normal</p>
          <IconButton
            aria-label="아이콘 버튼"
            icon={CloseIcon}
            size="lg"
            background="none"
            iconSize="lg"
            variant="primary"
          />
        </div>
        <div className="text-center">
          <p className="mb-2 text-fg-neutral-subtle text-sm">None Hover</p>
          <IconButton
            aria-label="아이콘 버튼"
            id="btn-none-hover"
            icon={CloseIcon}
            size="lg"
            background="none"
            iconSize="lg"
            variant="primary"
          />
        </div>
        <div className="text-center">
          <p className="mb-2 text-fg-neutral-subtle text-sm">None Neutral</p>
          <IconButton
            aria-label="아이콘 버튼"
            icon={CloseIcon}
            size="lg"
            background="none"
            iconSize="lg"
            variant="neutral"
          />
        </div>
      </div>

      {/* Circle Tests */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="mb-2 text-fg-neutral-subtle text-sm">Circle Normal</p>
          <IconButton
            aria-label="아이콘 버튼"
            icon={CloseIcon}
            size="xl"
            background="circle"
            backgroundSize="xs"
            iconSize="xs"
            variant="neutral"
          />
        </div>
        <div className="text-center">
          <p className="mb-2 text-fg-neutral-subtle text-sm">Circle Hover</p>
          <IconButton
            aria-label="아이콘 버튼"
            id="btn-circle-hover"
            icon={CloseIcon}
            size="xl"
            background="circle"
            backgroundSize="xs"
            iconSize="xs"
            variant="neutral"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    pseudo: {
      hover: [
        "#btn-square-hover",
        "#btn-none-hover",
        "#btn-circle-hover",
        "#btn-square-manual-hover",
      ],
      active: [],
    },
  },
};

export const Designs: Story = {
  render: () => (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        <span className="w-20 text-fg-neutral-subtle text-sm">Plus</span>
        <IconButton
          aria-label="아이콘 버튼"
          icon={PlusIcon}
          size="xl"
          background="square"
          backgroundSize="md"
          iconSize="lg"
          variant="primary"
          title="Normal state"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-plus-hover"
          icon={PlusIcon}
          size="xl"
          background="square"
          backgroundSize="md"
          iconSize="lg"
          variant="primary"
          title="Hover state"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-plus-pressed"
          icon={PlusIcon}
          size="xl"
          background="square"
          backgroundSize="md"
          iconSize="lg"
          variant="primary"
          title="Active/Pressed state"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-20 text-fg-neutral-subtle text-sm">Minus</span>
        <IconButton
          aria-label="아이콘 버튼"
          icon={MinusIcon}
          size="xl"
          background="square"
          backgroundSize="md"
          iconSize="lg"
          variant="surface"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-minus-hover"
          icon={MinusIcon}
          size="xl"
          background="square"
          backgroundSize="md"
          iconSize="lg"
          variant="surface"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-minus-pressed"
          icon={MinusIcon}
          size="xl"
          background="square"
          backgroundSize="md"
          iconSize="lg"
          variant="surface"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-20 text-fg-neutral-subtle text-sm">Delete</span>
        <IconButton
          aria-label="아이콘 버튼"
          icon={CloseIcon}
          size="xl"
          background="circle"
          backgroundSize="xs"
          iconSize="xs"
          variant="gray"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-delete-hover"
          icon={CloseIcon}
          size="xl"
          background="circle"
          backgroundSize="xs"
          iconSize="xs"
          variant="gray"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-delete-pressed"
          icon={CloseIcon}
          size="xl"
          background="circle"
          backgroundSize="xs"
          iconSize="xs"
          variant="gray"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-20 text-fg-neutral-subtle text-sm">Share</span>
        <IconButton
          aria-label="아이콘 버튼"
          icon={ShareIcon}
          size="2xl"
          background="square"
          backgroundSize="lg"
          iconSize="xl"
          variant="dark"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-share-hover"
          icon={ShareIcon}
          size="2xl"
          background="square"
          backgroundSize="lg"
          iconSize="xl"
          variant="dark"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-share-pressed"
          icon={ShareIcon}
          size="2xl"
          background="square"
          backgroundSize="lg"
          iconSize="xl"
          variant="dark"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-20 text-fg-neutral-subtle text-sm">Close</span>
        <IconButton
          aria-label="아이콘 버튼"
          icon={CloseIcon}
          size="lg"
          background="none"
          iconSize="lg"
          variant="neutral"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-close-hover"
          icon={CloseIcon}
          size="lg"
          background="none"
          iconSize="lg"
          variant="neutral"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-close-pressed"
          icon={CloseIcon}
          size="lg"
          background="none"
          iconSize="lg"
          variant="neutral"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-20 text-fg-neutral-subtle text-sm">
          Close Circle
        </span>
        <IconButton
          aria-label="아이콘 버튼"
          icon={CloseIcon}
          size="lg"
          background="circle"
          backgroundSize="sm"
          iconSize="sm"
          variant="neutral"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-close-circle-hover"
          icon={CloseIcon}
          size="lg"
          background="circle"
          backgroundSize="sm"
          iconSize="sm"
          variant="neutral"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-close-circle-pressed"
          icon={CloseIcon}
          size="lg"
          background="circle"
          backgroundSize="sm"
          iconSize="sm"
          variant="neutral"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-20 text-fg-neutral-subtle text-sm">
          Chevron Up/Down
        </span>
        <IconButton
          aria-label="아이콘 버튼"
          icon={ChevronUpIcon}
          size="sm"
          background="none"
          iconSize="md"
          variant="neutral"
        />
        <IconButton
          aria-label="아이콘 버튼"
          icon={ChevronDownIcon}
          size="sm"
          background="none"
          iconSize="md"
          variant="neutral"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-chevron-v-hover"
          icon={ChevronUpIcon}
          size="sm"
          background="none"
          iconSize="md"
          variant="neutral"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-chevron-v-pressed"
          icon={ChevronDownIcon}
          size="sm"
          background="none"
          iconSize="md"
          variant="neutral"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-20 text-fg-neutral-subtle text-sm">
          Chevron Left/Right
        </span>
        <IconButton
          aria-label="아이콘 버튼"
          icon={ChevronLeftIcon}
          size="md"
          background="none"
          iconSize="lg"
          variant="neutral"
        />
        <IconButton
          aria-label="아이콘 버튼"
          icon={ChevronRightIcon}
          size="md"
          background="none"
          iconSize="lg"
          variant="neutral"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-chevron-h-hover"
          icon={ChevronRightIcon}
          size="md"
          background="none"
          iconSize="lg"
          variant="neutral"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-chevron-h-pressed"
          icon={ChevronLeftIcon}
          size="md"
          background="none"
          iconSize="lg"
          variant="neutral"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-20 text-fg-neutral-subtle text-sm">
          Chevron Calendar
        </span>
        <IconButton
          aria-label="아이콘 버튼"
          icon={ChevronLeftIcon}
          size="md"
          background="square"
          backgroundSize="sm"
          iconSize="lg"
          variant="subtle"
        />
        <IconButton
          aria-label="아이콘 버튼"
          icon={ChevronRightIcon}
          size="md"
          background="square"
          backgroundSize="sm"
          iconSize="lg"
          variant="subtle"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-chevron-calendar-h-hover"
          icon={ChevronRightIcon}
          size="md"
          background="square"
          backgroundSize="sm"
          iconSize="lg"
          variant="subtle"
        />
        <IconButton
          aria-label="아이콘 버튼"
          id="icon-chevron-calendar-h-pressed"
          icon={ChevronLeftIcon}
          size="md"
          background="square"
          backgroundSize="sm"
          iconSize="lg"
          variant="subtle"
        />
      </div>
    </div>
  ),
  parameters: {
    pseudo: {
      hover:
        "#icon-plus-hover, #icon-minus-hover, #icon-delete-hover, #icon-share-hover, #icon-close-hover, #icon-close-circle-hover, #icon-chevron-v-hover, #icon-chevron-h-hover, #icon-chevron-calendar-h-hover",
      active:
        "#icon-plus-pressed, #icon-minus-pressed, #icon-delete-pressed, #icon-share-pressed, #icon-close-pressed, #icon-close-circle-pressed, #icon-chevron-v-pressed, #icon-chevron-h-pressed, #icon-chevron-calendar-h-pressed",
    },
  },
};
