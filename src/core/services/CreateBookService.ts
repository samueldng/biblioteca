import { CreateBookDTO } from "@/core/dtos/book.dto";
import { BookRepository } from "@/core/repositories/BookRepository";

export class BookServiceError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "BookServiceError";
  }
}

export class CreateBookService {
  static async execute(data: CreateBookDTO) {
    const category = await BookRepository.findCategoryById(data.categoryId);

    if (!category) {
      throw new BookServiceError("Categoria informada não existe.", 404);
    }

    if (data.isbn) {
      const existing = await BookRepository.findByIsbn(data.isbn);
      if (existing) {
        throw new BookServiceError("Já existe uma obra com este ISBN.", 409);
      }
    }

    return BookRepository.create(data);
  }
}
