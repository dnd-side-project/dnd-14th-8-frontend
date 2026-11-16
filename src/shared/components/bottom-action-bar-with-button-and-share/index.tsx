import { ActionArea, Button, Icon, IconButton } from "@moyeorak/design-system";
import type { ReactNode } from "react";

export interface BottomActionBarWithButtonAndShareProps {
  onClick: () => void;
  onShare: () => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

/** 공유 아이콘 버튼과 메인 버튼을 나란히 둔 icon 조합의 ActionArea. 화면 고정은 FixedBottomArea가 맡는다. */
export function BottomActionBarWithButtonAndShare({
  onClick,
  onShare,
  disabled,
  children,
  className,
}: BottomActionBarWithButtonAndShareProps) {
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
      main={
        <Button
          size="xl"
          display="full"
          variant="default"
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </Button>
      }
    />
  );
}
