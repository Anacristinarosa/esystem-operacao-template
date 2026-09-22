import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, ShieldAlert, CheckSquare, Building2 } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PLATAFORMA, type ModuloKey } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getOcorrenciasDaEmpresa } from "@/lib/data/modulos/ocorrencias";
import { getRiscosDaEmpresa } from "@/lib/data/modulos/riscos";
import { getAcoesDaEmpresa } from "@/lib/data/modulos/acoes";
import { getFornecedoresDaEmpresa } from "@/lib/data/modulos/fornecedores";
import { corPrioridade } from "@/lib/prioridade";

export const metadata = { title: "Início" };

const META = {
  ocorrencias: { href: "/ocorrencias", icone: AlertCircle, subtitulo: "Regista o que aconteceu e precisa de resposta." },
  riscos: { href: "/riscos", icone: ShieldAlert, subtitulo: "Mapa vivo do que pode falhar." },
  acoes: { href: "/acoes", icone: CheckSquare, subtitulo: "Correctivas, preventivas, de melhoria." },
  fornecedores: { href: "/fornecedores", icone: Building2, subtitulo: "Cadastro e avaliação periódica." },
} as const;

export default async function DashboardPage() {
  const perfil = await requerCliente();
  if (perfil.role === "founder") redirect("/admin");

  const modulosActivos = (Object.keys(PLATAFORMA.modulos) as ModuloKey[]).filter(
    (k) => PLATAFORMA.modulos[k],
  );
  const ancora = PLATAFORMA.ancora as ModuloKey;
  const outros = modulosActivos.filter((k) => k !== ancora);

  const ocorrencias = PLATAFORMA.modulos.ocorrencias ? await getOcorrenciasDaEmpresa(perfil.id) : [];
  const riscos = PLATAFORMA.modulos.riscos ? await getRiscosDaEmpresa(perfil.id) : [];
  const acoes = PLATAFORMA.modulos.acoes ? await getAcoesDaEmpresa(perfil.id) : [];
  const fornecedores = PLATAFORMA.modulos.fornecedores ? await getFornecedoresDaEmpresa(perfil.id) : [];

  const primeiroNome = perfil.nome?.split(" ")[0] ?? "olá";

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 gold-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                Olá, {primeiroNome}
              </p>
              <div className="w-8 gold-divider" />
            </div>
            <h1 className="font-serif italic text-3xl sm:text-4xl gold-text-rich">
              {PLATAFORMA.nome}
            </h1>
            <p className="mt-3 text-sm text-ink-soft italic">{PLATAFORMA.fraseAncora}</p>
          </div>

          {PLATAFORMA.modulos[ancora] && (
            <AncoraCard
              modulo={ancora}
              ocorrencias={ocorrencias}
              riscos={riscos}
              acoes={acoes}
              fornecedores={fornecedores}
            />
          )}

          {outros.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              {outros.map((k) => {
                const Icone = META[k].icone;
                const contagem =
                  k === "ocorrencias" ? ocorrencias.length :
                  k === "riscos" ? riscos.length :
                  k === "acoes" ? acoes.length :
                  fornecedores.length;
                return (
                  <Link
                    key={k}
                    href={META[k].href}
                    className="group block rounded-2xl bg-cream-50 gold-border-rich gold-shadow gold-glow-hover p-6 transition-all"
                  >
                    <div className="w-11 h-11 rounded-full bg-gold-foil gold-shadow flex items-center justify-center mb-4">
                      <Icone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="font-serif italic text-2xl gold-text-rich">
                        {PLATAFORMA.labels[k]}
                      </h3>
                      <span className="text-sm text-ink-soft">{contagem}</span>
                    </div>
                    <p className="text-sm text-ink-soft leading-relaxed">
                      {META[k].subtitulo}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}

          {modulosActivos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-ink-soft">A tua app está a ser preparada.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface RegistoBase {
  id: string;
  estado: string;
}

function AncoraCard({
  modulo,
  ocorrencias,
  riscos,
  acoes,
  fornecedores,
}: {
  modulo: ModuloKey;
  ocorrencias: Awaited<ReturnType<typeof getOcorrenciasDaEmpresa>>;
  riscos: Awaited<ReturnType<typeof getRiscosDaEmpresa>>;
  acoes: Awaited<ReturnType<typeof getAcoesDaEmpresa>>;
  fornecedores: Awaited<ReturnType<typeof getFornecedoresDaEmpresa>>;
}) {
  const Icone = META[modulo].icone;

  let itens: Array<{ id: string; nome: string; estado: string; extra: string | null }> = [];
  let total = 0;
  let href = META[modulo].href;

  if (modulo === "ocorrencias") {
    itens = ocorrencias.map((o) => ({ id: o.id, nome: o.titulo, estado: o.estado, extra: o.prioridade }));
    total = ocorrencias.length;
  } else if (modulo === "riscos") {
    itens = riscos.map((r) => ({ id: r.id, nome: r.titulo, estado: r.estado, extra: r.nivel }));
    total = riscos.length;
  } else if (modulo === "acoes") {
    itens = acoes.map((a) => ({ id: a.id, nome: a.titulo, estado: a.estado, extra: a.tipo }));
    total = acoes.length;
  } else if (modulo === "fornecedores") {
    itens = fornecedores.map((f) => ({ id: f.id, nome: f.nome, estado: f.estado, extra: f.categoria }));
    total = fornecedores.length;
  }

  return (
    <div className="rounded-3xl bg-cream-50 gold-border-rich gold-shadow p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gold-foil gold-shadow flex items-center justify-center">
          <Icone className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-1">
            {PLATAFORMA.labels[modulo]}
          </p>
          <p className="text-sm text-ink-soft">{META[modulo].subtitulo}</p>
        </div>
      </div>

      {itens.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-ink-soft italic mb-4">Sem registos por agora.</p>
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gold-700 hover:text-gold-800 border border-gold-300 rounded-lg"
          >
            Criar o primeiro →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {itens.slice(0, 4).map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between px-5 py-4 rounded-xl bg-white gold-border"
            >
              <div className="min-w-0 flex-1">
                <p className="font-serif italic text-lg text-ink truncate">{r.nome}</p>
                <p className="text-xs text-gold-700 uppercase tracking-wider mt-0.5">{r.estado}</p>
              </div>
              {r.extra && (
                <span className={`ml-3 px-2 py-1 text-xs rounded border ${corPrioridade(r.extra)}`}>
                  {r.extra}
                </span>
              )}
            </div>
          ))}
          {total > 4 && (
            <Link
              href={href}
              className="block text-center text-xs text-gold-700 hover:text-gold-800 pt-2"
            >
              Ver todos ({total}) →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
