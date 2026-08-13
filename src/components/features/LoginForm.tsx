"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowRight, ShieldAlert } from "lucide-react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const fieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: EASE_OUT_EXPO },
  }),
};

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricula: formData.get("matricula"),
          password: formData.get("password"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Credenciais inválidas. Tente novamente.");
        setIsSubmitting(false);
        return;
      }

      const destination =
        redirectTo ?? (result.user.role === "ADMIN" ? "/admin" : "/student/catalog");

      router.push(destination);
      router.refresh();
    } catch {
      setError("Erro de conexão com o servidor.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        className="mb-8 text-center lg:text-left"
      >
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Bem-vindo(a)</h2>
        <p className="text-zinc-400">
          Insira sua matrícula e senha para acessar o acervo.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 flex items-center gap-3"
            >
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div custom={0} initial="hidden" animate="visible" variants={fieldVariants} className="group">
          <label className="mb-1.5 block text-sm font-medium text-zinc-300 transition-colors group-focus-within:text-violet-400">
            Matrícula
          </label>
          <Input
            name="matricula"
            placeholder="Ex: 202400123"
            required
            autoComplete="username"
            className="h-12 border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:bg-zinc-900 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
          />
        </motion.div>

        <motion.div custom={1} initial="hidden" animate="visible" variants={fieldVariants} className="group">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium text-zinc-300 transition-colors group-focus-within:text-violet-400">
              Senha
            </label>
            <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Esqueceu a senha?
            </a>
          </div>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="h-12 border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:bg-zinc-900 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
          />
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={fieldVariants} className="mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="group h-12 w-full bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700 transition-all rounded-xl shadow-lg shadow-violet-900/20 overflow-hidden relative border border-violet-500/50"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center justify-center gap-2 font-medium">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  Entrar no sistema
                  <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
