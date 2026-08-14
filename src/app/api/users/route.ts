import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createStudentSchema } from "@/core/dtos/user.dto";
import { CreateStudentService, StudentServiceError } from "@/core/services/CreateStudentService";
import { UserRepository } from "@/core/repositories/UserRepository";
import { requireAdmin } from "@/lib/api-guard";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const search = request.nextUrl.searchParams.get("search") ?? undefined;
  const students = await UserRepository.findStudents({ search });

  return NextResponse.json(
    students.map((student) => ({
      id: student.id,
      name: student.name,
      matricula: student.matricula,
      course: student.course,
      turma: student.turma,
    }))
  );
}

export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const body = await request.json();
    const data = createStudentSchema.parse(body);

    const { user, initialPassword } = await CreateStudentService.execute(data);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          matricula: user.matricula,
          course: user.course,
          turma: user.turma,
        },
        initialPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos.", issues: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (error instanceof StudentServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error("[USER_POST_ERROR]", error);
    return NextResponse.json({ error: "Erro interno ao cadastrar aluno." }, { status: 500 });
  }
}
