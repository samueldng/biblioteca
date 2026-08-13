import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createCategorySchema } from "@/core/dtos/category.dto";
import { CreateCategoryService } from "@/core/services/CreateCategoryService";
import { CategoryRepository } from "@/core/repositories/CategoryRepository";
import { requireAdmin } from "@/lib/api-guard";

export async function GET() {
  const categories = await CategoryRepository.findAll();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const body = await request.json();
    const data = createCategorySchema.parse(body);

    const category = await CreateCategoryService.execute(data);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos.", issues: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error("[CATEGORY_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Erro interno ao criar categoria." },
      { status: 500 }
    );
  }
}
