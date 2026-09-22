import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { MudarEstado } from "@/components/modulos/mudar-estado";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getOcorrencia } from "@/lib/data/modulos/ocorrencias";
import { corPrioridade } from "@/lib/prioridade";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Ocorrência" };

export default async function OcorrenciaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const perfil = await requerCliente();
  const { id } = await params;
  const o = await getOcorrencia(id);
  if (!o) notFound();
  if (perfil.role !== "founder" && o.empresa_id !== perfil.id) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/ocorrencias"
            className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> {PLATAFORMA.labels.ocorrencias}
          </Link>

          <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">
              Ocorrência
            </p>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-serif italic text-3xl gold-text-rich">{o.titulo}</h1>
              {o.prioridade && (
                <span className={`px-3 py-1 text-sm rounded border ${corPrioridade(o.prioridade)}`}>
                  {o.prioridade}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-cream-50 gold-border gold-shadow p-6 mb-6">
            <MudarEstado
              tabela="ocorrencias"
              id={o.id}
              estadoActual={o.estado}
              estados={PLATAFORMA.estados.ocorrencias}
            />
          </div>

          <div className="rounded-2xl bg-white gold-border p-6 space-y-4">
            {o.descricao && (
              <Bloco label="Descrição">
                <p className="text-sm text-ink whitespace-pre-wrap">{o.descricao}</p>
              </Bloco>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {o.origem && <Bloco label="Origem"><p className="text-sm text-ink">{o.origem}</p></Bloco>}
              {o.severidade && <Bloco label="Severidade"><p className="text-sm text-ink">{o.severidade}</p></Bloco>}
              {o.frequencia && <Bloco label="Frequência"><p className="text-sm text-ink">{o.frequencia}</p></Bloco>}
              <Bloco label="Aberta em"><p className="text-sm text-ink">{formatarData(o.data_abertura)}</p></Bloco>
              {o.prazo && <Bloco label="Prazo"><p className="text-sm text-ink">{formatarData(o.prazo)}</p></Bloco>}
              {o.data_reavaliacao && (
                <Bloco label="Reavaliação"><p className="text-sm text-ink">{formatarData(o.data_reavaliacao)}</p></Bloco>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Bloco({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.2em] uppercase text-gold-600 mb-1">{label}</p>
      {children}
    </div>
  );
}
