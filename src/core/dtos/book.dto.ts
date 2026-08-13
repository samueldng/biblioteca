import { z } from "zod";

export const bookStatusSchema = z.enum([
  "AVAILABLE",
  "COMING_SOON",
  "BORROWED",
  "MAINTENANCE_LOST",
]);

export const createBookSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório."),
  author: z.string().trim().min(1, "Autor é obrigatório."),
  categoryId: z.string().uuid("Categoria inválida."),
  synopsis: z.string().trim().optional(),
  isbn: z.string().trim().optional(),
  publisher: z.string().trim().optional(),
  year: z.coerce.number().int().min(1000).max(3000).optional(),
  coverUrl: z.string().trim().optional(),
  status: bookStatusSchema.optional(),
});

export type CreateBookDTO = z.infer<typeof createBookSchema>;

export const updateBookSchema = createBookSchema.partial();

export type UpdateBookDTO = z.infer<typeof updateBookSchema>;

export const updateBookStatusSchema = z.object({
  status: bookStatusSchema,
});
