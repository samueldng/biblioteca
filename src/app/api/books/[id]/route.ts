import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { updateBookStatusSchema } from "@/core/dtos/book.dto";
import { UpdateBookStatusService } from "@/core/services/UpdateBookStatusService";
import { BookServiceError } from "@/core/services/CreateBookService";
import { requireAdmin } from "@/lib/api-guard";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const { id } = await params;
    const body = await request.json();
    const data = updateBookStatusSchema.parse(body);

    const book = await UpdateBookStatusService.execute(id, data.status);

    return NextResponse.json(book, { status: 200 });
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

    console.error("[BOOK_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Erro interno ao atualizar a obra." }, { status: 500 });
  }
}
