import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { AlterarPassword } from "@/components/definicoes/alterar-password";
import { Card } from "@/components/ui/card";
import { requerUtilizador } from "@/lib/auth";

export const metadata = { title: "Definições" };

export default async function DefinicoesPage() {
  const user = await requerUtilizador();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1 flex items-start justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 gold-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                Definições
              </p>
              <div className="w-8 gold-divider" />
            </div>
            <h1 className="font-serif italic text-3xl gold-text-rich mb-2">
              Alterar password
            </h1>
            <p className="text-sm text-ink-soft">
              Conta: {user.email}
            </p>
          </div>
          <Card variant="rich">
            <AlterarPassword />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
