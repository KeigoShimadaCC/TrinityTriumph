import { cn } from "../../utils/cn";

interface ProgressBarProps {
  value: number;
  color: string;
  label?: string;
  className?: string;
  smooth?: boolean;
}

export const ProgressBar = ({
  value,
  color,
  label,
  className,
  smooth = true
}: ProgressBarProps) => (
  <div className={cn("space-y-1", className)}>
    {label ? (
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
    ) : null}
    <div className="pixel-frame gb-shadow h-3 w-full overflow-hidden bg-[#c4d392]">
      <div
        className={cn("h-full", smooth && "transition-all duration-500")}
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  </div>
);
