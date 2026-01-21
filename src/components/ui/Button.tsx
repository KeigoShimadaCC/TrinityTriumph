import { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#8aa060] text-[#1f2a16] hover:brightness-105 active:translate-y-[1px]",
  secondary:
    "bg-[#a7bf74] text-[#1f2a16] hover:brightness-105 active:translate-y-[1px]",
  ghost:
    "bg-transparent text-[#1f2a16] border-2 border-[#4e6237] hover:bg-[#c4d392]"
};

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => (
  <button
    className={cn(
      "pixel-frame gb-shadow px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition",
      variantStyles[variant],
      className
    )}
    {...props}
  />
);
