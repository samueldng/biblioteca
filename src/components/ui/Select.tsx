import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 text-sm text-white shadow-inner transition-all focus:border-violet-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
