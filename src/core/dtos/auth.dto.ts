import { z } from "zod";

export const loginSchema = z.object({
  matricula: z.string().trim().min(1, "Matrícula é obrigatória."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export type LoginDTO = z.infer<typeof loginSchema>;
