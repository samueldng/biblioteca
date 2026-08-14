import { Library } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BookRepository } from "@/core/repositories/BookRepository";
import { BookForm } from "@/components/features/BookForm";
import { Badge } from "@/components/ui/Badge";
import { BookStatusControl } from "@/components/features/BookStatusControl";
import { FadeIn } from "@/components/ui/FadeIn";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function AdminBooksPage() {
  const [books, categories] = await Promise.all([
    BookRepository.findMany({}),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <FadeIn>
        <h1 className="text-2xl font-semibold text-white">Gestão de Acervo</h1>
        <p className="text-sm text-zinc-400">{books.length} obra(s) cadastrada(s)</p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <BookForm categories={categories} />
      </FadeIn>

      <FadeIn delay={0.1} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
        {books.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-zinc-500">
            <Library className="h-8 w-8" />
            <p className="text-sm">Nenhuma obra cadastrada ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Autor</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {books.map((book) => (
                  <tr key={book.id} className="transition-colors hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-white">{book.title}</td>
                    <td className="px-4 py-3 text-zinc-400">{book.author}</td>
                    <td className="px-4 py-3">
                      <Badge tone="violet">{book.category.name}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <BookStatusControl bookId={book.id} status={book.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
