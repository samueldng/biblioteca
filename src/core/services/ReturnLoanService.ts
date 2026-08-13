import { isPast } from "date-fns";
import { LoanRepository } from "@/core/repositories/LoanRepository";
import { LoanServiceError } from "@/core/services/CreateLoanService";

export class ReturnLoanService {
  static async execute(loanId: string) {
    const loan = await LoanRepository.findById(loanId);

    if (!loan) {
      throw new LoanServiceError("Empréstimo não encontrado.", 404);
    }

    if (loan.status !== "ACTIVE") {
      throw new LoanServiceError("Este empréstimo já foi finalizado.", 409);
    }

    const returnedAt = new Date();
    const status = isPast(loan.dueDate) ? "RETURNED_LATE" : "RETURNED_ON_TIME";

    return LoanRepository.returnWithBookUpdate({
      loanId: loan.id,
      bookId: loan.bookId,
      returnedAt,
      status,
    });
  }
}
