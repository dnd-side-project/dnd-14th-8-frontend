import {
  ActionArea,
  Button,
  type ButtonProps,
  Icon,
  IconButton,
} from "@moyeorak/design-system";
import type { ReactNode } from "react";

export interface BottomActionBarWithButtonAndShareProps {
  onClick: () => void;
  onShare: () => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  buttonVariant?: ButtonProps["variant"];
  showShareButton?: boolean;
}

/** 공유 버튼이 있으면 icon, 없으면 single 조합의 ActionArea. 화면 고정은 FixedBottomArea가 맡는다. */
export function BottomActionBarWithButtonAndShare({
  onClick,
  onShare,
  disabled,
  children,
  className,
  buttonVariant = "default",
  showShareButton = true,
}: BottomActionBarWithButtonAndShareProps) {
  const main = (
    <Button
      size="xl"
      display="full"
      variant={buttonVariant}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
  if (!showShareButton) {
    return <ActionArea type="single" className={className} main={main} />;
  }

  return (
    <ActionArea
      type="icon"
      className={className}
      sub={
        <IconButton
          size="lg"
          variant="fill"
          aria-label="공유하기"
          onClick={onShare}
        >
          <Icon type="share" size="md" />
        </IconButton>
      }
      main={main}
    />
  );
}
