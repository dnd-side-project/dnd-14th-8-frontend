import type { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-[375px] min-h-dvh">{children}</div>
  );
}
