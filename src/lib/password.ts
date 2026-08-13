import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

// Senha inicial do aluno: data de nascimento no formato DDMMAAAA.
export function birthDateToInitialPassword(birthDate: Date) {
  const day = String(birthDate.getUTCDate()).padStart(2, "0");
  const month = String(birthDate.getUTCMonth() + 1).padStart(2, "0");
  const year = birthDate.getUTCFullYear();
  return `${day}${month}${year}`;
}
