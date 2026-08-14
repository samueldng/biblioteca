import { NextResponse } from "next/server";
import { ReturnLoanService } from "@/core/services/ReturnLoanService";
import { LoanServiceError } from "@/core/services/CreateLoanService";
import { requireAdmin } from "@/lib/api-guard";

export const maxDuration = 30;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const { id } = await params;
    const returnedLoan = await ReturnLoanService.execute(id);

    return NextResponse.json(returnedLoan, { status: 200 });
  } catch (error) {
    if (error instanceof LoanServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error("[LOAN_RETURN_ERROR]", error);
    return NextResponse.json(
      { error: "Erro interno ao registrar a devolução." },
      { status: 500 }
    );
  }
}
