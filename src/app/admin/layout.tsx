import { LayoutDashboard, Library, ArrowLeftRight, GraduationCap } from "lucide-react";
import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/features/SiteHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <SiteHeader
        title="Painel do Bibliotecário"
        navItems={[
          { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
          { href: "/admin/books", label: "Acervo", icon: Library },
          { href: "/admin/loans", label: "Empréstimos", icon: ArrowLeftRight },
          { href: "/admin/users", label: "Alunos", icon: GraduationCap },
        ]}
        userName={session?.name ?? ""}
      />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
