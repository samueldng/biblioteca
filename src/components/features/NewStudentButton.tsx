"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuickStudentModal } from "@/components/features/QuickStudentModal";

export function NewStudentButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Novo aluno
      </Button>

      <QuickStudentModal
        open={open}
        onClose={() => {
          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
