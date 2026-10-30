import {
  ButtonBottom,
  type ButtonBottomProps,
} from "@/shared/components/button-bottom";
import { cn } from "@/shared/utils/cn";

export interface ButtonBottomTimetableEditProps extends ButtonBottomProps {
  description?: string;
  containerClassName?: string;
}

export function ButtonBottomTimetableEdit({
  description = "최대 30일, 0 ~ 24시까지 선택가능해요.",
  containerClassName,
  children = "저장하기",
  ...buttonProps
}: ButtonBottomTimetableEditProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 w-full",
        "flex flex-col items-center bg-bg-neutral-default",
        containerClassName,
      )}
    >
      {description && (
        <span className="textStyle_body4 text-fg-neutral-subtle">
          {description}
        </span>
      )}
      <ButtonBottom {...buttonProps}>{children}</ButtonBottom>
    </div>
  );
}
