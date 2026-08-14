import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createLoanSchema } from "@/core/dtos/loan.dto";
import { CreateLoanService, LoanServiceError } from "@/core/services/CreateLoanService";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSession } from "@/lib/api-guard";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const guard = await requireSession();
  if (!guard.ok) return guard.response;

  const requestedUserId = request.nextUrl.searchParams.get("userId") ?? undefined;
  // Aluno só pode ver o próprio histórico; admin pode filtrar por qualquer aluno ou ver tudo.
  const userId = guard.session.role === "ADMIN" ? requestedUserId : guard.session.sub;

  const loans = await prisma.loan.findMany({
    where: { userId },
    include: { book: true, user: true },
    orderBy: { borrowedAt: "desc" },
  });

  return NextResponse.json(loans);
}

export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const body = await request.json();
    const data = createLoanSchema.parse(body);

    const newLoan = await CreateLoanService.execute(data);

    return NextResponse.json(newLoan, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos.", issues: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (error instanceof LoanServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error("[LOAN_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Erro interno ao registrar o empréstimo." },
      { status: 500 }
    );
  }
}
