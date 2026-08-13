import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto."),
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
