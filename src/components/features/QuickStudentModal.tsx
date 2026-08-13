"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, KeyRound } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const COURSE_OPTIONS = [
  { value: "ELETROTECNICA", label: "Eletrotécnica" },
  { value: "REFRIGERACAO", label: "Refrigeração e Climatização" },
  { value: "ZOOTECNIA", label: "Zootecnia" },
  { value: "OUTROS", label: "Outros" },
];

interface CreatedStudent {
  id: string;
  name: string;
  matricula: string;
}

export function QuickStudentModal({
  open,
  onClose,
  onCreated,
  defaultMatricula,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (student: CreatedStudent) => void;
  defaultMatricula?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ student: CreatedStudent; password: string } | null>(
    null
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const birthDate = formData.get("birthDate");

    const payload = {
      name: formData.get("name"),
      matricula: formData.get("matricula"),
      course: formData.get("course"),
      turma: formData.get("turma"),
      birthDate: birthDate ? birthDate : undefined,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Erro ao cadastrar aluno.");
        return;
      }

      setResult({ student: data.user, password: data.initialPassword });
      toast.success("Aluno cadastrado com sucesso.");
      onCreated?.(data.user);
    } catch {
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setResult(null);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={result ? "Aluno cadastrado" : "Cadastro rápido de aluno"}
      description={
        result ? undefined : "Nome, matrícula, curso e turma são obrigatórios."
      }
    >
      {result ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">{result.student.name}</p>
              <p className="text-xs text-zinc-400">Matrícula {result.student.matricula}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
            <KeyRound className="h-5 w-5 shrink-0 text-violet-300" />
            <div>
              <p className="text-xs text-zinc-400">Senha inicial de acesso</p>
              <p className="font-mono text-sm font-semibold text-white">{result.password}</p>
            </div>
          </div>

          <Button type="button" onClick={handleClose} className="w-full">
            Concluir
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input name="name" placeholder="Nome completo *" required />
          <Input
            name="matricula"
            placeholder="Matrícula *"
            defaultValue={defaultMatricula}
            required
          />

          <Select name="course" defaultValue="" required>
            <option value="" disabled>
              Curso *
            </option>
            {COURSE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Input name="turma" placeholder="Turma *" required />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">
              Data de nascimento (define a senha inicial, opcional)
            </label>
            <Input name="birthDate" type="date" />
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? "Cadastrando..." : "Cadastrar aluno"}
          </Button>
        </form>
      )}
    </Modal>
  );
}
