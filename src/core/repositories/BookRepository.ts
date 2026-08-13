import { prisma } from "@/lib/prisma";
import { CreateBookDTO } from "@/core/dtos/book.dto";
import { BookStatus } from "@prisma/client";

export class BookRepository {
  static findCategoryById(categoryId: string) {
    return prisma.category.findUnique({ where: { id: categoryId } });
  }

  static findByIsbn(isbn: string) {
    return prisma.book.findUnique({ where: { isbn } });
  }

  static findById(id: string) {
    return prisma.book.findUnique({ where: { id } });
  }

  static create(data: CreateBookDTO) {
    return prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        categoryId: data.categoryId,
        synopsis: data.synopsis,
        isbn: data.isbn,
        publisher: data.publisher,
        year: data.year,
        coverUrl: data.coverUrl,
        status: data.status,
      },
    });
  }

  static updateStatus(id: string, status: BookStatus) {
    return prisma.book.update({ where: { id }, data: { status } });
  }

  static findMany(params: { categoryId?: string; search?: string; status?: BookStatus }) {
    return prisma.book.findMany({
      where: {
        categoryId: params.categoryId,
        status: params.status,
        OR: params.search
          ? [
              { title: { contains: params.search, mode: "insensitive" } },
              { author: { contains: params.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: { category: true },
      orderBy: { title: "asc" },
    });
  }

  static findManyWithActiveLoan(params: { categoryId?: string; search?: string }) {
    return prisma.book.findMany({
      where: {
        categoryId: params.categoryId,
        OR: params.search
          ? [
              { title: { contains: params.search, mode: "insensitive" } },
              { author: { contains: params.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: {
        category: true,
        loans: { where: { status: "ACTIVE" }, take: 1 },
      },
      orderBy: { title: "asc" },
    });
  }
}
