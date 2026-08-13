import { addDays } from "date-fns";
import { CreateLoanDTO } from "@/core/dtos/loan.dto";
import { LoanRepository } from "@/core/repositories/LoanRepository";
import { prisma } from "@/lib/prisma";

export class LoanServiceError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "LoanServiceError";
  }
}

// Prazo padrão de empréstimo da biblioteca escolar; ajustável conforme regra do IEMA.
const LOAN_PERIOD_DAYS = 14;

export class CreateLoanService {
  static async execute(data: CreateLoanDTO) {
    const book = await prisma.book.findUnique({ where: { id: data.bookId } });
    if (!book) {
      throw new LoanServiceError("Livro informado não existe.", 404);
    }

    if (book.status !== "AVAILABLE") {
      throw new LoanServiceError("Livro não está disponível para empréstimo.", 409);
    }

    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new LoanServiceError("Usuário informado não existe.", 404);
    }

    // Regra: um aluno só pode ter um empréstimo ativo por vez.
    const activeLoan = await LoanRepository.findActiveByUser(data.userId);
    if (activeLoan) {
      throw new LoanServiceError("Usuário já possui um empréstimo ativo.", 409);
    }

    const borrowedAt = new Date();
    const dueDate = addDays(borrowedAt, LOAN_PERIOD_DAYS);

    return LoanRepository.createWithBookUpdate({
      bookId: data.bookId,
      userId: data.userId,
      borrowedAt,
      dueDate,
    });
  }
}
