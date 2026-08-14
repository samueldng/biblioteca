import { NextResponse } from "next/server";
import { RankingService } from "@/core/services/RankingService";
import { requireSession } from "@/lib/api-guard";

export const maxDuration = 30;

export async function GET() {
  const guard = await requireSession();
  if (!guard.ok) return guard.response;

  const ranking = await RankingService.getMonthlyRanking();
  return NextResponse.json(ranking);
}
