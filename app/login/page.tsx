import { LoginForm } from "@/components/auth/login-form";
import { PLATAFORMA } from "@/lib/config";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          {PLATAFORMA.marcaMae && (
            <p className="text-[11px] tracking-[0.35em] uppercase text-gold-700 mb-6">
              {PLATAFORMA.marcaMae}
            </p>
          )}

          <h1 className="font-serif italic text-5xl sm:text-6xl gold-text-rich mb-14">
            {PLATAFORMA.nome}
          </h1>

          <p className="font-serif italic text-2xl gold-text-rich mb-3">
            Bem-vinda
          </p>
          <p className="text-sm text-ink-soft mb-10">
            Escreve o teu email e a tua palavra-passe para entrares.
          </p>

          <div className="rounded-2xl bg-cream-50 gold-border-rich gold-shadow px-6 sm:px-8 py-8 text-left">
            <LoginForm />
          </div>
        </div>
      </main>

      <footer className="py-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 gold-divider" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
            {PLATAFORMA.marcaMae ? `${PLATAFORMA.marcaMae} · ${PLATAFORMA.nome}` : PLATAFORMA.nome}
          </p>
          <div className="w-8 gold-divider" />
        </div>
        <p className="text-[11px] text-ink-faint">
          © {new Date().getFullYear()} {PLATAFORMA.marcaMae ?? PLATAFORMA.nome}. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
