"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LucideIcon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  function closeDrawer() {
    setDrawerOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">{title}</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden gap-1 sm:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-white/5 hover:text-white ${
                    pathname === item.href
                      ? "bg-white/5 text-white"
                      : "text-zinc-400"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop user menu */}
            <div className="hidden sm:flex">
              <UserMenu name={userName} />
            </div>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white sm:hidden"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay + panel */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDrawer}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm sm:hidden"
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col border-l border-white/10 bg-zinc-950/95 backdrop-blur-xl sm:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">{title}</span>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer nav */}
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeDrawer}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white ${
                      pathname === item.href
                        ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                        : "text-zinc-400"
                    }`}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Drawer footer — user info + logout */}
              <div className="border-t border-white/10 px-5 py-4">
                <div className="mb-3">
                  <p className="text-xs text-zinc-500">Conectado como</p>
                  <p className="text-sm font-medium text-white truncate">{userName}</p>
                </div>
                <UserMenu name={userName} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
