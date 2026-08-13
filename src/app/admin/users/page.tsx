import { GraduationCap } from "lucide-react";
import { UserRepository } from "@/core/repositories/UserRepository";
import { Badge } from "@/components/ui/Badge";
import { NewStudentButton } from "@/components/features/NewStudentButton";
import { FadeIn } from "@/components/ui/FadeIn";
import { COURSE_LABEL } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const students = await UserRepository.findStudents({});

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <FadeIn className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Alunos</h1>
          <p className="text-sm text-zinc-400">{students.length} aluno(s) cadastrado(s)</p>
        </div>
        <NewStudentButton />
      </FadeIn>

      <FadeIn delay={0.1} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
        {students.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-zinc-500">
            <GraduationCap className="h-8 w-8" />
            <p className="text-sm">Nenhum aluno cadastrado ainda.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Matrícula</th>
                <th className="px-4 py-3">Curso</th>
                <th className="px-4 py-3">Turma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-white">{student.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{student.matricula}</td>
                  <td className="px-4 py-3">
                    <Badge tone="violet">
                      {student.course ? COURSE_LABEL[student.course] : "—"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{student.turma ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </FadeIn>
    </div>
  );
}
