import { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

export const Screen = ({ children, className }: ScreenProps) => (
  <div
    className={cn(
      "relative min-h-screen bg-neon-ink text-white",
      "flex flex-col items-center justify-between px-4 py-6",
      "gridlines",
      className
    )}
  >
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
    <div className="relative z-10 flex h-full w-full max-w-md flex-col gap-5">
      {children}
    </div>
  </div>
);
