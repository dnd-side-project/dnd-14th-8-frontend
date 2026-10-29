import {
  ActionArea,
  Button,
  type ButtonProps,
  Icon,
  IconButton,
} from "@moyeorak/design-system";
import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface BottomActionBarWithButtonAndShareProps {
  onClick: () => void;
  onShare: () => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  buttonVariant?: ButtonProps["variant"];
  showShareButton?: boolean;
}

/** 화면 하단에 고정한 ActionArea. 공유 버튼이 있으면 icon, 없으면 single 조합을 쓴다. */
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
  const areaClassName = cn(
    "fixed inset-x-0 bottom-0 z-30 mx-auto sm:max-w-[375px]",
    className,
  );

  if (!showShareButton) {
    return <ActionArea type="single" className={areaClassName} main={main} />;
  }

  return (
    <ActionArea
      type="icon"
      className={areaClassName}
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
