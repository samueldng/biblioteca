import { Book, Loan } from "@prisma/client";
import { differenceInSeconds, isPast } from "date-fns";

export interface BookAvailabilityDTO {
  bookId: string;
  status: Book["status"];
  isAvailable: boolean;
  availableAt: Date | null;
  countdownSeconds: number | null;
}

export class BookAvailabilityService {
  /**
   * Calcula a disponibilidade em tempo real e o countdown.
   * Trabalha estritamente com datas em UTC para consistência.
   */
  static getAvailability(
    book: Book,
    activeLoan: Loan | null
  ): BookAvailabilityDTO {
    const nowUtc = new Date();

    if (book.status === "AVAILABLE") {
      return {
        bookId: book.id,
        status: "AVAILABLE",
        isAvailable: true,
        availableAt: nowUtc,
        countdownSeconds: null,
      };
    }

    if (book.status === "BORROWED" && activeLoan) {
      const isOverdue = isPast(activeLoan.dueDate);
      const secondsLeft = isOverdue
        ? 0
        : differenceInSeconds(activeLoan.dueDate, nowUtc);

      return {
        bookId: book.id,
        status: "BORROWED",
        isAvailable: false,
        availableAt: activeLoan.dueDate,
        countdownSeconds: secondsLeft,
      };
    }

    return {
      bookId: book.id,
      status: book.status,
      isAvailable: false,
      availableAt: null,
      countdownSeconds: null,
    };
  }
}
