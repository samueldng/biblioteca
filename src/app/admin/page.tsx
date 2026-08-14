import { Library, ArrowLeftRight, GraduationCap, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { RankingService } from "@/core/services/RankingService";
import { RankingBoard } from "@/components/features/RankingBoard";
import { FadeIn } from "@/components/ui/FadeIn";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

async function getStats() {
  const [totalBooks, activeLoans, totalStudents, overdueLoans] = await Promise.all([
    prisma.book.count(),
    prisma.loan.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.loan.count({ where: { status: "ACTIVE", dueDate: { lt: new Date() } } }),
  ]);

  return { totalBooks, activeLoans, totalStudents, overdueLoans };
}

export default async function AdminDashboardPage() {
  const [stats, ranking] = await Promise.all([getStats(), RankingService.getMonthlyRanking(5)]);

  const cards = [
    { label: "Obras no acervo", value: stats.totalBooks, icon: Library, tone: "text-cyan-400" },
    {
      label: "Empréstimos ativos",
      value: stats.activeLoans,
      icon: ArrowLeftRight,
      tone: "text-violet-400",
    },
    {
      label: "Alunos cadastrados",
      value: stats.totalStudents,
      icon: GraduationCap,
      tone: "text-emerald-400",
    },
    {
      label: "Empréstimos atrasados",
      value: stats.overdueLoans,
      icon: AlertTriangle,
      tone: "text-red-400",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <FadeIn>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400">Visão geral da biblioteca</p>
      </FadeIn>

      <FadeIn delay={0.05} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
          >
            <card.icon className={`h-5 w-5 ${card.tone}`} />
            <div>
              <p className="text-2xl font-semibold text-white">{card.value}</p>
              <p className="text-xs text-zinc-500">{card.label}</p>
            </div>
          </div>
        ))}
      </FadeIn>

      <FadeIn delay={0.1}>
        <RankingBoard entries={ranking} compact />
      </FadeIn>
    </div>
  );
}
