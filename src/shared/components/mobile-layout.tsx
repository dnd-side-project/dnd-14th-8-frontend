import type { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[375px]">{children}</div>
  );
}
