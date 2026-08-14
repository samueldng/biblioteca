import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/features/SiteHeader";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <SiteHeader
        title="Biblioteca IEMA"
        navItems={[
          { href: "/student/catalog", label: "Catálogo", icon: "catalog" },
          { href: "/student/loans", label: "Meus Empréstimos", icon: "myLoans" },
          { href: "/student/ranking", label: "Ranking", icon: "ranking" },
        ]}
        userName={session?.name ?? ""}
      />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
