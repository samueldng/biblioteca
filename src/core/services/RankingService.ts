import { startOfMonth, endOfMonth } from "date-fns";
import { prisma } from "@/lib/prisma";

export interface RankingEntry {
  userId: string;
  name: string;
  matricula: string | null;
  turma: string | null;
  booksReturned: number;
}

export class RankingService {
  /**
   * Ranking dos alunos que mais devolveram obras no prazo dentro do mês corrente.
   * Usa groupBy (agregação no banco) sobre o índice [status, returnedAt] para
   * evitar varrer a tabela inteira de empréstimos a cada consulta.
   */
  static async getMonthlyRanking(limit = 10): Promise<RankingEntry[]> {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const grouped = await prisma.loan.groupBy({
      by: ["userId"],
      where: {
        status: "RETURNED_ON_TIME",
        returnedAt: { gte: start, lte: end },
      },
      _count: { _all: true },
      orderBy: { _count: { userId: "desc" } },
      take: limit,
    });

    if (grouped.length === 0) return [];

    const users = await prisma.user.findMany({
      where: { id: { in: grouped.map((g) => g.userId) } },
      select: { id: true, name: true, matricula: true, turma: true },
    });

    return grouped
      .map((entry) => {
        const user = users.find((u) => u.id === entry.userId);
        return {
          userId: entry.userId,
          name: user?.name ?? "Aluno removido",
          matricula: user?.matricula ?? null,
          turma: user?.turma ?? null,
          booksReturned: entry._count._all,
        };
      })
      .sort((a, b) => b.booksReturned - a.booksReturned);
  }
}
