import { CreateCategoryDTO } from "@/core/dtos/category.dto";
import { CategoryRepository } from "@/core/repositories/CategoryRepository";

export class CreateCategoryService {
  // Idempotente: se a categoria já existir (criação "on the fly" concorrente), retorna a existente.
  static async execute(data: CreateCategoryDTO) {
    const existing = await CategoryRepository.findByName(data.name);
    if (existing) return existing;

    return CategoryRepository.create(data.name);
  }
}
