import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/features/SiteHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <SiteHeader
        title="Painel do Bibliotecário"
        navItems={[
          { href: "/admin", label: "Dashboard", icon: "dashboard" },
          { href: "/admin/books", label: "Acervo", icon: "library" },
          { href: "/admin/loans", label: "Empréstimos", icon: "loans" },
          { href: "/admin/users", label: "Alunos", icon: "students" },
        ]}
        userName={session?.name ?? ""}
      />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
