import { prisma } from "@/lib/prisma";

export class CategoryRepository {
  static findAll() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  static findByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  }

  static create(name: string) {
    return prisma.category.create({ data: { name } });
  }
}
