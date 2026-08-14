import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { History } from "lucide-react";
import { LoanRepository } from "@/core/repositories/LoanRepository";
import { Badge } from "@/components/ui/Badge";
import { NewLoanPanel } from "@/components/features/NewLoanPanel";
import { ReturnLoanButton } from "@/components/features/ReturnLoanButton";
import { LOAN_STATUS_LABEL, LOAN_STATUS_TONE } from "@/lib/labels";
import { FadeIn } from "@/components/ui/FadeIn";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function AdminLoansPage() {
  const loans = await LoanRepository.findAllWithDetails();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <FadeIn>
        <h1 className="text-2xl font-semibold text-white">Circulação</h1>
        <p className="text-sm text-zinc-400">Empréstimos, devoluções e rastreio do acervo</p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <NewLoanPanel />
      </FadeIn>

      <FadeIn delay={0.1} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <History className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-medium text-zinc-300">Histórico ({loans.length})</h2>
        </div>

        {loans.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-zinc-500">
            Nenhum empréstimo registrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Aluno</th>
                  <th className="px-4 py-3">Obra</th>
                  <th className="px-4 py-3">Saída</th>
                  <th className="px-4 py-3">Previsão</th>
                  <th className="px-4 py-3">Devolução</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loans.map((loan) => (
                  <tr key={loan.id} className="transition-colors hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{loan.user.name}</p>
                      <p className="text-xs text-zinc-500">{loan.user.matricula}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{loan.book.title}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {format(loan.borrowedAt, "dd/MM/yyyy", { locale: ptBR })}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {format(loan.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {loan.returnedAt
                        ? format(loan.returnedAt, "dd/MM/yyyy", { locale: ptBR })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={LOAN_STATUS_TONE[loan.status]}>
                        {LOAN_STATUS_LABEL[loan.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {loan.status === "ACTIVE" && (
                        <ReturnLoanButton loanId={loan.id} bookTitle={loan.book.title} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
