import { prisma } from "@/lib/prisma";
import { Course } from "@prisma/client";

export class UserRepository {
  static findByMatricula(matricula: string) {
    return prisma.user.findUnique({ where: { matricula } });
  }

  static findStudents(params: { search?: string }) {
    return prisma.user.findMany({
      where: {
        role: "STUDENT",
        OR: params.search
          ? [
              { name: { contains: params.search, mode: "insensitive" } },
              { matricula: { contains: params.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: { name: "asc" },
    });
  }

  static create(data: {
    name: string;
    matricula: string;
    course: Course;
    turma: string;
    hashedPassword: string;
    birthDate?: Date;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        matricula: data.matricula,
        course: data.course,
        turma: data.turma,
        hashedPassword: data.hashedPassword,
        birthDate: data.birthDate,
        role: "STUDENT",
      },
    });
  }
}
