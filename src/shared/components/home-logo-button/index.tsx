import type { ButtonHTMLAttributes } from "react";
import MoyeorakLogo from "@/assets/moyeorak-logo.svg?react";
import { cn } from "@/shared/utils/cn";

/** 워드마크 원본이 238x62라 pill 높이에 맞추면서 비율을 유지한 값 */
const LOGO_HEIGHT = 20;
const LOGO_WIDTH = 77;

export type HomeLogoButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function HomeLogoButton({
  className,
  type = "button",
  ...props
}: HomeLogoButtonProps) {
  return (
    <button
      aria-label="모여락 홈으로"
      className={cn(
        "z-30 inline-flex h-10 items-center justify-center rounded-full",
        "border border-primary-main/20 bg-k-5 px-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.18)]",
        "transition-colors enabled:cursor-pointer enabled:active:bg-k-50 enabled:hover:bg-white",
        "focus-visible:outline-2 focus-visible:outline-primary-main focus-visible:outline-offset-2",
        className,
      )}
      type={type}
      {...props}
    >
      <MoyeorakLogo aria-hidden height={LOGO_HEIGHT} width={LOGO_WIDTH} />
    </button>
  );
}
