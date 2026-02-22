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
}

export function BottomActionBarWithButtonAndShare({
  tone,
  onClick,
  onShare,
  children,
  className,
}: BottomActionBarWithButtonAndShareProps) {
  return (
    <BottomActionBar
      tone={tone}
      className={cn("flex items-center gap-2", className)}
    >
      <ShareIconButton onClick={onShare} />
      <ButtonBottom onClick={onClick} className="w-full flex-1" variant="black">
        {children}
      </ButtonBottom>
    </BottomActionBar>
  );
}

const ShareIconButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton
      icon={ShareIcon}
      size="2xl"
      background="square"
      backgroundSize="lg"
      iconSize="xl"
      variant="dark"
      onClick={onClick}
    />
  );
};
