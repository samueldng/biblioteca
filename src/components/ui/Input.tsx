import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 text-sm text-white shadow-inner placeholder:text-zinc-600 transition-all focus:border-violet-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-500",
          className
        )}
        {...props}
      />
    );
  }
);
