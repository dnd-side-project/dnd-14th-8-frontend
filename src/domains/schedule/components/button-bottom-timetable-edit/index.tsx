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
        "flex flex-col items-center bg-k-5",
        containerClassName,
      )}
    >
      {description && <span className="text-b4 text-k-600">{description}</span>}
      <ButtonBottom {...buttonProps}>{children}</ButtonBottom>
    </div>
  );
}
