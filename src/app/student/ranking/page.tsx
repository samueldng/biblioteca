import { RankingService } from "@/core/services/RankingService";
import { RankingBoard } from "@/components/features/RankingBoard";
import { FadeIn } from "@/components/ui/FadeIn";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function StudentRankingPage() {
  const ranking = await RankingService.getMonthlyRanking(20);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <FadeIn>
        <h1 className="text-2xl font-semibold text-white">Ranking do Mês</h1>
        <p className="text-sm text-zinc-400">
          Alunos que mais devolveram obras no prazo este mês
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <RankingBoard entries={ranking} />
      </FadeIn>
    </div>
  );
}
