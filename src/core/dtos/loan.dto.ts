import { z } from "zod";

export const createLoanSchema = z.object({
  bookId: z.string().uuid("Livro inválido."),
  userId: z.string().uuid("Usuário inválido."),
});

export type CreateLoanDTO = z.infer<typeof createLoanSchema>;
