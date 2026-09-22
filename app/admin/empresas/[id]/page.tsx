import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  ShieldAlert,
  CheckSquare,
  Building2,
} from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { requerFounder } from "@/lib/auth";
import { getEmpresa } from "@/lib/data/admin";
import { getOcorrenciasDaEmpresa } from "@/lib/data/modulos/ocorrencias";
import { getRiscosDaEmpresa } from "@/lib/data/modulos/riscos";
import { getAcoesDaEmpresa } from "@/lib/data/modulos/acoes";
import { getFornecedoresDaEmpresa } from "@/lib/data/modulos/fornecedores";
import { PLATAFORMA } from "@/lib/config";
import { corPrioridade } from "@/lib/prioridade";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Empresa" };

export default async function EmpresaFichaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requerFounder();
  const { id } = await params;
  const empresa = await getEmpresa(id);
  if (!empresa) notFound();

  const ocorrencias = PLATAFORMA.modulos.ocorrencias ? await getOcorrenciasDaEmpresa(id) : [];
  const riscos = PLATAFORMA.modulos.riscos ? await getRiscosDaEmpresa(id) : [];
  const acoes = PLATAFORMA.modulos.acoes ? await getAcoesDaEmpresa(id) : [];
  const fornecedores = PLATAFORMA.modulos.fornecedores ? await getFornecedoresDaEmpresa(id) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> Painel
          </Link>

          <div className="mb-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">Empresa</p>
            <h1 className="font-serif italic text-4xl gold-text-rich mb-2">
              {empresa.empresa_nome ?? empresa.nome ?? "—"}
            </h1>
            <p className="text-sm text-ink-soft">
              {empresa.nome ?? "—"} · {empresa.email}
            </p>
            <p className="text-xs text-ink-faint mt-1">
              Registada {formatarData(empresa.criada_em)}
              {empresa.ultima_entrada && ` · última entrada ${formatarData(empresa.ultima_entrada)}`}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {PLATAFORMA.modulos.ocorrencias && (
              <Bloco
                titulo={PLATAFORMA.labels.ocorrencias}
                icone={AlertCircle}
                total={ocorrencias.length}
              >
                {ocorrencias.length === 0 ? (
                  <p className="text-sm text-ink-soft italic">Sem registos.</p>
                ) : (
                  <ul className="space-y-2">
                    {ocorrencias.slice(0, 6).map((o) => (
                      <li
                        key={o.id}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <Link
                          href={`/ocorrencias/${o.id}`}
                          className="truncate hover:text-gold-700"
                        >
                          {o.titulo}
                        </Link>
                        {o.prioridade && (
                          <span
                            className={`shrink-0 px-2 py-0.5 text-xs rounded border ${corPrioridade(o.prioridade)}`}
                          >
                            {o.prioridade}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Bloco>
            )}

            {PLATAFORMA.modulos.riscos && (
              <Bloco titulo={PLATAFORMA.labels.riscos} icone={ShieldAlert} total={riscos.length}>
                {riscos.length === 0 ? (
                  <p className="text-sm text-ink-soft italic">Sem registos.</p>
                ) : (
                  <ul className="space-y-2">
                    {riscos.slice(0, 6).map((r) => (
                      <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
                        <Link href={`/riscos/${r.id}`} className="truncate hover:text-gold-700">
                          {r.titulo}
                        </Link>
                        {r.nivel && (
                          <span
                            className={`shrink-0 px-2 py-0.5 text-xs rounded border ${corPrioridade(r.nivel)}`}
                          >
                            {r.nivel}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Bloco>
            )}

            {PLATAFORMA.modulos.acoes && (
              <Bloco titulo={PLATAFORMA.labels.acoes} icone={CheckSquare} total={acoes.length}>
                {acoes.length === 0 ? (
                  <p className="text-sm text-ink-soft italic">Sem registos.</p>
                ) : (
                  <ul className="space-y-2">
                    {acoes.slice(0, 6).map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                        <Link href={`/acoes/${a.id}`} className="truncate hover:text-gold-700">
                          {a.titulo}
                        </Link>
                        <span className="shrink-0 text-xs text-gold-700 uppercase tracking-wider">
                          {a.estado}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Bloco>
            )}

            {PLATAFORMA.modulos.fornecedores && (
              <Bloco
                titulo={PLATAFORMA.labels.fornecedores}
                icone={Building2}
                total={fornecedores.length}
              >
                {fornecedores.length === 0 ? (
                  <p className="text-sm text-ink-soft italic">Sem registos.</p>
                ) : (
                  <ul className="space-y-2">
                    {fornecedores.slice(0, 6).map((f) => (
                      <li key={f.id} className="flex items-center justify-between gap-2 text-sm">
                        <Link
                          href={`/fornecedores/${f.id}`}
                          className="truncate hover:text-gold-700"
                        >
                          {f.nome}
                        </Link>
                        <span className="shrink-0 text-xs text-gold-700 uppercase tracking-wider">
                          {f.estado}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Bloco>
            )}
          </div>

          <div className="mt-10 rounded-xl bg-gold-50 gold-border p-5 text-sm text-ink-soft">
            <p className="font-medium text-ink mb-2">Como esta empresa usa a app</p>
            <p>
              Cada empresa faz a sua operação sozinha — regista, muda estados, avalia
              fornecedores. Tu vês tudo aqui em modo leitura, sem interferir.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Bloco({
  titulo,
  icone: Icone,
  total,
  children,
}: {
  titulo: string;
  icone: typeof AlertCircle;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-cream-50 gold-border gold-shadow p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icone className="w-4 h-4 text-gold-600" />
          <p className="text-[10px] uppercase tracking-widest text-gold-700 font-medium">
            {titulo}
          </p>
        </div>
        <span className="text-xs text-ink-faint">{total}</span>
      </div>
      {children}
    </div>
  );
}
