import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { MudarEstado } from "@/components/modulos/mudar-estado";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getRisco } from "@/lib/data/modulos/riscos";
import { corPrioridade } from "@/lib/prioridade";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Risco" };

export default async function RiscoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const perfil = await requerCliente();
  const { id } = await params;
  const r = await getRisco(id);
  if (!r) notFound();
  if (perfil.role !== "founder" && r.empresa_id !== perfil.id) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/riscos"
            className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> {PLATAFORMA.labels.riscos}
          </Link>

          <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">Risco</p>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-serif italic text-3xl gold-text-rich">{r.titulo}</h1>
              {r.nivel && (
                <span className={`px-3 py-1 text-sm rounded border ${corPrioridade(r.nivel)}`}>
                  {r.nivel}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-cream-50 gold-border gold-shadow p-6 mb-6">
            <MudarEstado
              tabela="riscos"
              id={r.id}
              estadoActual={r.estado}
              estados={PLATAFORMA.estados.riscos}
            />
          </div>

          <div className="rounded-2xl bg-white gold-border p-6 space-y-4">
            {r.descricao && (
              <Bloco label="Descrição">
                <p className="text-sm text-ink whitespace-pre-wrap">{r.descricao}</p>
              </Bloco>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {r.categoria && <Bloco label="Categoria"><p className="text-sm text-ink">{r.categoria}</p></Bloco>}
              {r.probabilidade && <Bloco label="Probabilidade"><p className="text-sm text-ink">{r.probabilidade}</p></Bloco>}
              {r.impacto && <Bloco label="Impacto"><p className="text-sm text-ink">{r.impacto}</p></Bloco>}
              {r.data_revisao && (
                <Bloco label="Data de revisão"><p className="text-sm text-ink">{formatarData(r.data_revisao)}</p></Bloco>
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
