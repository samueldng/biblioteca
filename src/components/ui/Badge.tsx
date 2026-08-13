import { cn } from "@/lib/utils";

type BadgeTone = "green" | "amber" | "red" | "zinc" | "violet";

const toneClasses: Record<BadgeTone, string> = {
  green: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  amber: "border border-amber-500/20 bg-amber-500/10 text-amber-400",
  red: "border border-red-500/20 bg-red-500/10 text-red-400",
  zinc: "border border-white/10 bg-white/5 text-zinc-300",
  violet: "border border-violet-500/20 bg-violet-500/10 text-violet-300",
};

export function Badge({
  tone = "zinc",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
