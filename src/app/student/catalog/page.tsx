import { Search, SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BookRepository } from "@/core/repositories/BookRepository";
import { BookCard } from "@/components/features/BookCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function StudentCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoryId?: string }>;
}) {
  const { search, categoryId } = await searchParams;

  const [books, categories] = await Promise.all([
    BookRepository.findManyWithActiveLoan({ search, categoryId }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <FadeIn>
        <h1 className="text-2xl font-semibold text-white">Catálogo da Biblioteca</h1>
        <p className="text-sm text-zinc-400">IEMA Pleno Alto Alegre do Pindaré</p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <form className="flex flex-col gap-3 sm:flex-row" method="get">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              name="search"
              placeholder="Buscar por título ou autor..."
              defaultValue={search}
              className="pl-9"
            />
          </div>
          <div className="relative sm:max-w-xs">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Select name="categoryId" defaultValue={categoryId ?? ""} className="pl-9">
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" variant="secondary">
            Filtrar
          </Button>
        </form>
      </FadeIn>

      {books.length === 0 ? (
        <p className="text-sm text-zinc-500">Nenhuma obra encontrada.</p>
      ) : (
        <FadeIn delay={0.1} className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </FadeIn>
      )}
    </div>
  );
}
