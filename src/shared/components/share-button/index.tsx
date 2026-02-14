import type {
  ButtonHTMLAttributes,
  ComponentType,
  ReactNode,
  SVGProps,
} from "react";
import ShareKakaoTalkIcon from "@/assets/share/kakaotalk.svg?react";
import ShareLinkIcon from "@/assets/share/link.svg?react";
import ShareMoreIcon from "@/assets/share/more.svg?react";
import { cn } from "@/shared/utils/cn";

export type ShareChannel = "kakaotalk" | "link" | "more";

const SHARE_BUTTON_CHANNELS = {
  kakaotalk: { Icon: ShareKakaoTalkIcon, label: "카카오톡" },
  link: { Icon: ShareLinkIcon, label: "링크복사" },
  more: { Icon: ShareMoreIcon, label: "더보기" },
} satisfies Record<
  ShareChannel,
  { Icon: ComponentType<SVGProps<SVGSVGElement>>; label: string }
>;

export interface ShareButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  channel?: ShareChannel;
  label?: ReactNode;
}

export function ShareButton({
  channel = "kakaotalk",
  className,
  label,
  type = "button",
  ...props
}: ShareButtonProps) {
  const { Icon, label: defaultLabel } = SHARE_BUTTON_CHANNELS[channel];

  return (
    <button
      className={cn(
        "inline-flex cursor-pointer select-none flex-col items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-k-10 active:bg-k-50",
        className,
      )}
      type={type}
      {...props}
    >
      <Icon aria-hidden className="size-14 shrink-0" />
      <span className="text-b4 text-k-700">{label ?? defaultLabel}</span>
    </button>
  );
}
