import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-violet-500/50 bg-violet-600 text-white shadow-lg shadow-violet-900/20 hover:bg-violet-500 active:bg-violet-700",
  secondary:
    "border border-white/10 bg-white/5 text-zinc-200 backdrop-blur hover:bg-white/10 hover:text-white",
  danger:
    "border border-red-500/40 bg-red-600/90 text-white hover:bg-red-500",
  ghost: "text-zinc-400 hover:bg-white/5 hover:text-white",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
