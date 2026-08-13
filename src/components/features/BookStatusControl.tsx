"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Disponível" },
  { value: "COMING_SOON", label: "Em breve" },
  { value: "BORROWED", label: "Emprestado" },
  { value: "MAINTENANCE_LOST", label: "Indisponível" },
];

export function BookStatusControl({ bookId, status }: { bookId: string; status: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = event.target.value;
    setIsUpdating(true);

    const response = await fetch(`/api/books/${bookId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "Erro ao atualizar status.");
      setIsUpdating(false);
      return;
    }

    toast.success("Status atualizado.");
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isUpdating}
      className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-xs text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
