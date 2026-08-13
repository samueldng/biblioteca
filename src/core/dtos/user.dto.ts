import { z } from "zod";

export const courseSchema = z.enum(["ELETROTECNICA", "REFRIGERACAO", "ZOOTECNIA", "OUTROS"]);

export const createStudentSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto."),
  matricula: z.string().trim().min(1, "Matrícula é obrigatória."),
  course: courseSchema,
  turma: z.string().trim().min(1, "Turma é obrigatória."),
  birthDate: z.coerce.date().optional(),
});

export type CreateStudentDTO = z.infer<typeof createStudentSchema>;
