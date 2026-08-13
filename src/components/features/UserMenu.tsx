"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function UserMenu({ name }: { name: string }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-zinc-600 dark:text-zinc-400 sm:inline">{name}</span>
      <Button variant="secondary" onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? "Saindo..." : "Sair"}
      </Button>
    </div>
  );
}
