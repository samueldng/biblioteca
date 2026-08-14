import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { BookStatus } from "@prisma/client";
import { createBookSchema } from "@/core/dtos/book.dto";
import { CreateBookService, BookServiceError } from "@/core/services/CreateBookService";
import { BookRepository } from "@/core/repositories/BookRepository";
import { requireAdmin } from "@/lib/api-guard";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const status = (searchParams.get("status") as BookStatus | null) ?? undefined;

  const books = await BookRepository.findMany({ categoryId, search, status });
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const body = await request.json();
    const data = createBookSchema.parse(body);

    const newBook = await CreateBookService.execute(data);

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos.", issues: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (error instanceof BookServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error("[BOOK_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar a obra." },
      { status: 500 }
    );
  }
}
