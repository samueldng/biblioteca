import { Book, Loan } from "@prisma/client";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CountdownTimer } from "@/components/features/CountdownTimer";
import { BookAvailabilityService } from "@/core/services/BookAvailabilityService";
import { BOOK_STATUS_LABEL, BOOK_STATUS_TONE } from "@/lib/labels";

type BookWithCategory = Book & {
  category: { name: string };
  loans?: Loan[];
};

export function BookCard({ book }: { book: BookWithCategory }) {
  const activeLoan = book.loans?.[0] ?? null;
  const availability = BookAvailabilityService.getAvailability(book, activeLoan);

  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-xl transition-colors hover:border-violet-500/30 hover:bg-white/[0.05]">
      <div className="flex aspect-[2/3] items-center justify-center overflow-hidden rounded-xl bg-zinc-900 text-zinc-700">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <BookOpen className="h-8 w-8" />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Badge tone="violet" className="w-fit">
          {book.category.name}
        </Badge>
        <h3 className="line-clamp-2 text-sm font-semibold text-white">{book.title}</h3>
        <p className="text-xs text-zinc-500">{book.author}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2">
        <Badge tone={BOOK_STATUS_TONE[book.status]}>{BOOK_STATUS_LABEL[book.status]}</Badge>
        {availability.status === "BORROWED" && availability.availableAt && (
          <span className="text-xs text-zinc-500">
            <CountdownTimer dueDate={availability.availableAt} />
          </span>
        )}
      </div>
    </div>
  );
}
