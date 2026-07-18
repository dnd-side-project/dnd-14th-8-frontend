import type { ReactNode } from "react";
import {
  BottomActionBar,
  type BottomActionBarTone,
} from "@/shared/components/bottom-action-bar";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { IconButton } from "@/shared/components/icon-button";
import { ShareIcon } from "@/shared/components/icons";
import { cn } from "@/shared/utils/cn";

export interface BottomActionBarWithButtonAndShareProps {
  tone?: BottomActionBarTone;
  onClick: () => void;
  onShare: () => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  buttonVariant?: "black" | "blue" | "white";
}

export function BottomActionBarWithButtonAndShare({
  tone,
  onClick,
  onShare,
  disabled,
  children,
  className,
  buttonVariant = "white",
}: BottomActionBarWithButtonAndShareProps) {
  return (
    <BottomActionBar
      tone={tone}
      className={cn("flex items-center gap-2", className)}
    >
      <IconButton
        aria-label="공유하기"
        background="square"
        backgroundSize="lg"
        icon={ShareIcon}
        iconSize="xl"
        onClick={onShare}
        size="2xl"
        variant="primary"
      />
      <ButtonBottom
        disabled={disabled}
        onClick={onClick}
        className="min-w-0 flex-1 px-4"
        variant={buttonVariant}
      >
        {children}
      </ButtonBottom>
    </BottomActionBar>
  );
}
