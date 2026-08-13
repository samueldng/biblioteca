"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BookOpen, Search, UserPlus, UserCheck, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { QuickStudentModal } from "@/components/features/QuickStudentModal";

interface BookOption {
  id: string;
  title: string;
  author: string;
}

interface StudentOption {
  id: string;
  name: string;
  matricula: string;
}

export function NewLoanPanel() {
  const router = useRouter();

  const [bookSearch, setBookSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<BookOption | null>(null);

  const [matricula, setMatricula] = useState("");
  const [student, setStudent] = useState<StudentOption | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const booksQuery = useQuery({
    queryKey: ["available-books", bookSearch],
    queryFn: async (): Promise<BookOption[]> => {
      const res = await fetch(
        `/api/books?status=AVAILABLE&search=${encodeURIComponent(bookSearch)}`
      );
      return res.json();
    },
    enabled: bookSearch.trim().length >= 2 && !selectedBook,
  });

  async function handleSearchStudent() {
    if (!matricula.trim()) return;
    setNotFound(false);

    const res = await fetch(`/api/users?search=${encodeURIComponent(matricula.trim())}`);
    const data: StudentOption[] = await res.json();
    const match = data.find((s) => s.matricula === matricula.trim());

    if (match) {
      setStudent(match);
    } else {
      setStudent(null);
      setNotFound(true);
    }
  }

  function handleStudentCreated(created: StudentOption) {
    setStudent(created);
    setNotFound(false);
    setShowQuickModal(false);
  }

  async function handleCreateLoan() {
    if (!selectedBook || !student) {
      toast.error("Selecione o livro e o aluno.");
      return;
    }

    setIsSubmitting(true);

    const res = await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: selectedBook.id, userId: student.id }),
    });
    const data = await res.json();

    setIsSubmitting(false);

    if (!res.ok) {
      toast.error(data.error ?? "Erro ao registrar empréstimo.");
      return;
    }

    toast.success(`Empréstimo de "${selectedBook.title}" registrado para ${student.name}.`);
    setSelectedBook(null);
    setBookSearch("");
    setStudent(null);
    setMatricula("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
      <h2 className="text-lg font-semibold text-white">Novo empréstimo</h2>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <BookOpen className="h-4 w-4" /> Livro
          </label>

          {selectedBook ? (
            <div className="flex items-center justify-between rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-white">{selectedBook.title}</p>
                <p className="text-xs text-zinc-400">{selectedBook.author}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Input
                value={bookSearch}
                onChange={(event) => setBookSearch(event.target.value)}
                placeholder="Buscar por título ou autor..."
              />
              {bookSearch.trim().length >= 2 && (
                <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-2xl backdrop-blur-xl">
                  {booksQuery.isFetching && (
                    <p className="px-3 py-2 text-xs text-zinc-500">Buscando...</p>
                  )}
                  {!booksQuery.isFetching && booksQuery.data?.length === 0 && (
                    <p className="px-3 py-2 text-xs text-zinc-500">
                      Nenhum livro disponível encontrado.
                    </p>
                  )}
                  {booksQuery.data?.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => {
                        setSelectedBook(book);
                        setBookSearch("");
                      }}
                      className="flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/5"
                    >
                      <span className="text-sm text-white">{book.title}</span>
                      <span className="text-xs text-zinc-500">{book.author}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <UserCheck className="h-4 w-4" /> Aluno
          </label>

          {student ? (
            <div className="flex items-center justify-between rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-white">{student.name}</p>
                <p className="text-xs text-zinc-400">Matrícula {student.matricula}</p>
              </div>
              <button
                type="button"
                onClick={() => setStudent(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Input
                  value={matricula}
                  onChange={(event) => {
                    setMatricula(event.target.value);
                    setNotFound(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSearchStudent();
                    }
                  }}
                  placeholder="Matrícula do aluno"
                />
                <Button type="button" variant="secondary" onClick={handleSearchStudent}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {notFound && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2"
                >
                  <p className="text-xs text-amber-300">Aluno não encontrado.</p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowQuickModal(true)}
                    className="h-8 px-2 text-xs"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Cadastrar
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      <Button
        type="button"
        onClick={handleCreateLoan}
        disabled={isSubmitting || !selectedBook || !student}
        className="self-start"
      >
        {isSubmitting ? "Registrando..." : "Registrar empréstimo"}
      </Button>

      {showQuickModal && (
        <QuickStudentModal
          key={matricula}
          open={showQuickModal}
          onClose={() => setShowQuickModal(false)}
          onCreated={handleStudentCreated}
          defaultMatricula={matricula}
        />
      )}
    </div>
  );
}
