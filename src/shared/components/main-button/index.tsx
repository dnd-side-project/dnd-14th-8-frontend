import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface MainButtonProps {
  title?: string;
  description?: string;
  character?: ReactNode;
  characterClassName?: string;
  className?: string;
  onClick?: () => void;
}

export function MainButton({
  title,
  description,
  character,
  characterClassName,
  className,
  onClick,
}: MainButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative h-[160px] w-full cursor-pointer rounded-xl py-[26px] pr-[15px] pl-7 shadow-[0_3px_6px_0_#CACACA]",
        "flex items-center justify-between overflow-hidden",
        className,
      )}
    >
      <div className="z-10 flex flex-col gap-2 text-left">
        <h3 className="text-h3 text-k-5">{title}</h3>
        <p className="whitespace-pre-line text-b2 text-k-5">{description}</p>
      </div>

      {character && (
        <div className={cn("absolute shrink-0 leading-0", characterClassName)}>
          {character}
        </div>
      )}
    </button>
  );
}
