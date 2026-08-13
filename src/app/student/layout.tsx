import { LibraryBig, ListChecks, Trophy } from "lucide-react";
import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/features/SiteHeader";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <SiteHeader
        title="Biblioteca IEMA"
        navItems={[
          { href: "/student/catalog", label: "Catálogo", icon: LibraryBig },
          { href: "/student/loans", label: "Meus Empréstimos", icon: ListChecks },
          { href: "/student/ranking", label: "Ranking", icon: Trophy },
        ]}
        userName={session?.name ?? ""}
      />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
