import { LoginDTO } from "@/core/dtos/auth.dto";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export class AuthError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "AuthError";
  }
}

export class LoginService {
  static async execute(data: LoginDTO) {
    const user = await prisma.user.findUnique({ where: { matricula: data.matricula } });

    if (!user || !user.hashedPassword) {
      throw new AuthError("Matrícula ou senha inválida.", 401);
    }

    const isValid = await verifyPassword(data.password, user.hashedPassword);
    if (!isValid) {
      throw new AuthError("Matrícula ou senha inválida.", 401);
    }

    return {
      id: user.id,
      name: user.name,
      matricula: user.matricula,
      role: user.role,
    };
  }
}
