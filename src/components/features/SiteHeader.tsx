import Link from "next/link";
import { BookOpen, LucideIcon } from "lucide-react";
import { UserMenu } from "@/components/features/UserMenu";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function SiteHeader({
  title,
  navItems,
  userName,
}: {
  title: string;
  navItems: NavItem[];
  userName: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">{title}</span>
          </div>
          <nav className="hidden gap-1 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <UserMenu name={userName} />
      </div>
    </header>
  );
}
