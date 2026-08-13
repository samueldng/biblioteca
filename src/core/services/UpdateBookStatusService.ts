import { BookStatus } from "@prisma/client";
import { BookRepository } from "@/core/repositories/BookRepository";
import { LoanRepository } from "@/core/repositories/LoanRepository";
import { BookServiceError } from "@/core/services/CreateBookService";

export class UpdateBookStatusService {
  static async execute(bookId: string, status: BookStatus) {
    const book = await BookRepository.findById(bookId);
    if (!book) {
      throw new BookServiceError("Obra não encontrada.", 404);
    }

    const activeLoan = await LoanRepository.findActiveByBook(bookId);
    if (activeLoan && status !== "BORROWED") {
      throw new BookServiceError(
        "Esta obra tem um empréstimo ativo. Registre a devolução antes de alterar o status.",
        409
      );
    }

    return BookRepository.updateStatus(bookId, status);
  }
}
