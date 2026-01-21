import { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-neon-red text-white shadow-heat hover:brightness-110 active:scale-[0.98]",
  secondary:
    "bg-neon-cyan text-black shadow-glow hover:brightness-110 active:scale-[0.98]",
  ghost:
    "border border-white/30 text-white/80 hover:text-white hover:border-white"
};

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => (
  <button
    className={cn(
      "rounded-xl px-4 py-2 text-sm font-semibold tracking-wide transition",
      variantStyles[variant],
      className
    )}
    {...props}
  />
);
