import { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

export const Screen = ({ children, className }: ScreenProps) => (
  <div
    className={cn(
      "relative h-full bg-neon-ink text-white",
      "flex flex-col items-center justify-between px-3 py-4",
      "gridlines",
      className
    )}
  >
    <div className="pointer-events-none absolute inset-0 opacity-40" />
    <div className="relative z-10 flex h-full w-full flex-col gap-4">
      {children}
    </div>
  </div>
);
