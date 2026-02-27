import type { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <main className="mx-auto min-h-dvh w-full bg-k-5 sm:max-w-[375px]">
      {children}
    </main>
  );
}
