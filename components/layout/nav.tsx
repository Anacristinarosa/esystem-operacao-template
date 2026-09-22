import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { getPerfil } from "@/lib/auth";

interface NavProps {
  autenticado?: boolean;
}

export async function Nav({ autenticado = false }: NavProps) {
  let founder = false;
  if (autenticado) {
    const perfil = await getPerfil();
    founder = perfil?.role === "founder";
  }

  return (
    <nav
      className="border-b backdrop-blur-sm"
      style={{
        borderColor: "rgba(237, 217, 150, 0.4)",
        backgroundColor: "rgba(253, 251, 245, 0.8)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          {autenticado ? (
            <>
              <Button href="/dashboard" variant="ghost" size="sm">
                Início
              </Button>
              {founder && (
                <Button href="/admin" variant="ghost" size="sm">
                  Painel
                </Button>
              )}
              <Button href="/definicoes" variant="ghost" size="sm">
                Definições
              </Button>
              <form action="/api/auth/logout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  Sair
                </Button>
              </form>
            </>
          ) : (
            <Button href="/login" size="sm">
              Entrar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
