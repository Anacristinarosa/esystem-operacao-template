import { redirect } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { getUtilizador } from "@/lib/auth";
import { PLATAFORMA } from "@/lib/config";

export default async function Home() {
  const user = await getUtilizador();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          {PLATAFORMA.marcaMae && (
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-4">
              {PLATAFORMA.marcaMae}
            </p>
          )}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 gold-divider" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
              {PLATAFORMA.iniciais}
            </p>
            <div className="w-8 gold-divider" />
          </div>

          <h1 className="font-serif italic text-5xl sm:text-6xl gold-text-rich mb-6">
            {PLATAFORMA.nome}
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-ink mb-4">
            {PLATAFORMA.fraseAncora}
          </p>

          <p className="text-sm sm:text-base text-ink-soft mb-10">
            {PLATAFORMA.subtitulo}
          </p>

          <Button href="/login" size="lg">
            Entrar
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
