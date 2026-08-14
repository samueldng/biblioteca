import { LoginForm } from "@/components/features/LoginForm";
import { BookOpen, Library, ChevronDown } from "lucide-react";
import { BookRepository } from "@/core/repositories/BookRepository";
import { BookCard } from "@/components/features/BookCard";
import { FadeIn } from "@/components/ui/FadeIn";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  const books = await BookRepository.findManyWithActiveLoan({});

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      {/* ───── Hero: Login ───── */}
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left panel - Branding / Visuals */}
        <div className="relative hidden w-1/2 lg:block overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
          
          {/* Abstract pattern / Mesh */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", 
              backgroundSize: "32px 32px" 
            }} 
          />
          
          {/* Glow effects */}
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-violet-600/30 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[0%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[100px]" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
            <div className="mb-10 rounded-2xl bg-white/5 p-8 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center">
              {/* Custom Logo Replacement */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-4xl font-black tracking-tighter text-white uppercase flex items-center">
                    IEMA
                    <span className="ml-2 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500">
                      Biblio
                    </span>
                  </span>
                </div>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-3" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                Instituto de Educação, Ciência e Tecnologia do Maranhão
              </span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4 drop-shadow-sm">
              Gestão de Biblioteca
            </h1>
            <p className="text-lg text-zinc-300 max-w-md drop-shadow-sm">
              Descubra, reserve e acompanhe suas leituras no IEMA Pleno Alto Alegre do Pindaré.
            </p>
          </div>
        </div>

        {/* Right panel - Form */}
        <div className="flex w-full items-center justify-center lg:w-1/2 p-8 sm:p-12 xl:p-24 relative overflow-hidden">
          {/* Fluid background for mobile/tablet fallback */}
          <div className="absolute inset-0 bg-zinc-950 lg:bg-zinc-900/50" />
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] pointer-events-none lg:hidden" />
          
          <div className="relative z-10 w-full max-w-sm">
            {/* Logo for mobile only */}
            <div className="lg:hidden mb-12 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-white uppercase">
                  IEMA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500">Biblio</span>
                </span>
              </div>
              <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />
              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 text-center">
                Instituto de Educação, Ciência<br/>e Tecnologia do Maranhão
              </span>
            </div>
            
            <LoginForm redirectTo={from} />
          </div>
        </div>
      </div>

      {/* ───── Scroll hint (floating arrow) ───── */}
      {books.length > 0 && (
        <div className="flex justify-center -mt-16 pb-4 relative z-20">
          <a
            href="#acervo"
            className="flex flex-col items-center gap-1 text-zinc-500 transition-colors hover:text-violet-400 animate-bounce"
          >
            <span className="text-xs font-medium">Ver acervo</span>
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>
      )}

      {/* ───── Public catalog ───── */}
      {books.length > 0 && (
        <section
          id="acervo"
          className="relative border-t border-white/10 scroll-mt-0"
        >
          {/* Subtle glow behind the section */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/10 blur-[120px]" />

          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <FadeIn>
              <div className="mb-10 flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10">
                  <Library className="h-6 w-6 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Acervo da Biblioteca
                </h2>
                <p className="max-w-lg text-sm text-zinc-400">
                  Confira todos os livros disponíveis na nossa biblioteca.
                  Livros emprestados mostram o tempo restante para devolução.
                </p>
              </div>
            </FadeIn>

            {/* Stats bar */}
            <FadeIn delay={0.05}>
              <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 font-medium">
                    {books.filter((b) => b.status === "AVAILABLE").length} disponíveis
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-amber-400 font-medium">
                    {books.filter((b) => b.status === "BORROWED").length} emprestados
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
                  <span className="text-zinc-300 font-medium">
                    {books.length} obras no total
                  </span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </FadeIn>
          </div>
        </section>
      )}
    </div>
  );
}
