import { Trophy } from "lucide-react";
import { RankingEntry } from "@/core/services/RankingService";
import { cn } from "@/lib/utils";

const RANK_STYLES: Record<number, string> = {
  0: "bg-gradient-to-br from-amber-300 to-amber-600 text-amber-950 shadow-lg shadow-amber-900/30",
  1: "bg-gradient-to-br from-zinc-300 to-zinc-500 text-zinc-950",
  2: "bg-gradient-to-br from-orange-400 to-orange-700 text-orange-950",
};

export function RankingBoard({ entries, compact = false }: { entries: RankingEntry[]; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-400" />
        <h2 className="text-lg font-semibold text-white">Ranking de Leitores do Mês</h2>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Ninguém devolveu obras no prazo este mês ainda. Seja o primeiro!
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.slice(0, compact ? 5 : entries.length).map((entry, index) => (
            <li
              key={entry.userId}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  RANK_STYLES[index] ?? "bg-white/10 text-zinc-300"
                )}
              >
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{entry.name}</p>
                {entry.turma && <p className="text-xs text-zinc-500">{entry.turma}</p>}
              </div>
              <span className="text-sm font-semibold text-violet-300">
                {entry.booksReturned} {entry.booksReturned === 1 ? "livro" : "livros"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
