"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ReturnLoanButton({ loanId, bookTitle }: { loanId: string; bookTitle: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleReturn() {
    setIsSubmitting(true);

    const response = await fetch(`/api/loans/${loanId}/return`, { method: "POST" });
    const result = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      toast.error(result.error ?? "Erro ao registrar devolução.");
      return;
    }

    toast.success(`Devolução de "${bookTitle}" registrada.`);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleReturn}
      disabled={isSubmitting}
      className="h-8 px-2 text-xs"
    >
      <Undo2 className="h-3.5 w-3.5" />
      {isSubmitting ? "..." : "Devolver"}
    </Button>
  );
}
