import { BookX } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { CountdownTimer } from "@/components/features/CountdownTimer";
import { FadeIn } from "@/components/ui/FadeIn";
import { LOAN_STATUS_LABEL, LOAN_STATUS_TONE } from "@/lib/labels";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function StudentLoansPage() {
  const session = await getSession();

  const loans = session
    ? await prisma.loan.findMany({
        where: { userId: session.sub },
        include: { book: true },
        orderBy: { borrowedAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <FadeIn>
        <h1 className="text-2xl font-semibold text-white">Meus Empréstimos</h1>
        <p className="text-sm text-zinc-400">{loans.length} registro(s)</p>
      </FadeIn>

      {loans.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-zinc-500">
          <BookX className="h-8 w-8" />
          <p className="text-sm">Você ainda não realizou nenhum empréstimo.</p>
        </div>
      ) : (
        <FadeIn delay={0.1} className="flex flex-col gap-3">
          {loans.map((loan) => (
            <li
              key={loan.id}
              className="flex list-none items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl"
            >
              <div>
                <p className="font-medium text-white">{loan.book.title}</p>
                <p className="text-xs text-zinc-500">{loan.book.author}</p>
              </div>

              <div className="flex items-center gap-3">
                {loan.status === "ACTIVE" && (
                  <span className="text-xs text-zinc-500">
                    <CountdownTimer dueDate={loan.dueDate} />
                  </span>
                )}
                <Badge tone={LOAN_STATUS_TONE[loan.status]}>{LOAN_STATUS_LABEL[loan.status]}</Badge>
              </div>
            </li>
          ))}
        </FadeIn>
      )}
    </div>
  );
}
