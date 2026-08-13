import { prisma } from "@/lib/prisma";

export class LoanRepository {
  static findActiveByUser(userId: string) {
    return prisma.loan.findFirst({
      where: { userId, status: "ACTIVE" },
    });
  }

  static findActiveByBook(bookId: string) {
    return prisma.loan.findFirst({
      where: { bookId, status: "ACTIVE" },
    });
  }

  static findById(id: string) {
    return prisma.loan.findUnique({ where: { id }, include: { book: true } });
  }

  static findAllWithDetails() {
    return prisma.loan.findMany({
      include: { book: true, user: true },
      orderBy: { borrowedAt: "desc" },
    });
  }

  static createWithBookUpdate(params: {
    bookId: string;
    userId: string;
    borrowedAt: Date;
    dueDate: Date;
  }) {
    return prisma.$transaction(async (tx) => {
      const loan = await tx.loan.create({
        data: {
          bookId: params.bookId,
          userId: params.userId,
          borrowedAt: params.borrowedAt,
          dueDate: params.dueDate,
          status: "ACTIVE",
        },
      });

      await tx.book.update({
        where: { id: params.bookId },
        data: { status: "BORROWED" },
      });

      return loan;
    });
  }

  static returnWithBookUpdate(params: {
    loanId: string;
    bookId: string;
    returnedAt: Date;
    status: "RETURNED_ON_TIME" | "RETURNED_LATE";
  }) {
    return prisma.$transaction(async (tx) => {
      const loan = await tx.loan.update({
        where: { id: params.loanId },
        data: { returnedAt: params.returnedAt, status: params.status },
      });

      await tx.book.update({
        where: { id: params.bookId },
        data: { status: "AVAILABLE" },
      });

      return loan;
    });
  }
}
