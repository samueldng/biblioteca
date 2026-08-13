import { CreateStudentDTO } from "@/core/dtos/user.dto";
import { UserRepository } from "@/core/repositories/UserRepository";
import { hashPassword, birthDateToInitialPassword } from "@/lib/password";

export class StudentServiceError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "StudentServiceError";
  }
}

export class CreateStudentService {
  static async execute(data: CreateStudentDTO) {
    const existing = await UserRepository.findByMatricula(data.matricula);
    if (existing) {
      throw new StudentServiceError("Já existe um aluno cadastrado com esta matrícula.", 409);
    }

    // Senha inicial: data de nascimento (DDMMAAAA) se informada, senão a própria matrícula.
    const initialPassword = data.birthDate
      ? birthDateToInitialPassword(data.birthDate)
      : data.matricula;

    const user = await UserRepository.create({
      name: data.name,
      matricula: data.matricula,
      course: data.course,
      turma: data.turma,
      birthDate: data.birthDate,
      hashedPassword: await hashPassword(initialPassword),
    });

    return { user, initialPassword };
  }
}
