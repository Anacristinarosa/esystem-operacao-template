import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { MudarEstado } from "@/components/modulos/mudar-estado";
import { MarcarEficacia } from "@/components/modulos/marcar-eficacia";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getAcao } from "@/lib/data/modulos/acoes";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Ação" };

export default async function AcaoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const perfil = await requerCliente();
  const { id } = await params;
  const a = await getAcao(id);
  if (!a) notFound();
  if (perfil.role !== "founder" && a.empresa_id !== perfil.id) notFound();

  const podeAvaliarEficacia =
    a.estado === "Concluída" || a.estado === "Verificada" || a.estado === "Fechada";

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/acoes"
            className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> {PLATAFORMA.labels.acoes}
          </Link>

          <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">Ação</p>
            <h1 className="font-serif italic text-3xl gold-text-rich">{a.titulo}</h1>
          </div>

          <div className="rounded-2xl bg-cream-50 gold-border gold-shadow p-6 mb-6">
            <MudarEstado
              tabela="acoes"
              id={a.id}
              estadoActual={a.estado}
              estados={PLATAFORMA.estados.acoes}
            />
          </div>

          <div className="rounded-2xl bg-white gold-border p-6 space-y-4 mb-6">
            {a.descricao && (
              <Bloco label="Descrição">
                <p className="text-sm text-ink whitespace-pre-wrap">{a.descricao}</p>
              </Bloco>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {a.tipo && <Bloco label="Tipo"><p className="text-sm text-ink">{a.tipo}</p></Bloco>}
              {a.prazo && <Bloco label="Prazo"><p className="text-sm text-ink">{formatarData(a.prazo)}</p></Bloco>}
              {a.data_conclusao && (
                <Bloco label="Concluída em"><p className="text-sm text-ink">{formatarData(a.data_conclusao)}</p></Bloco>
              )}
              {a.eficacia_data && (
                <Bloco label="Eficácia avaliada"><p className="text-sm text-ink">{formatarData(a.eficacia_data)}</p></Bloco>
              )}
              {a.eficacia_veredicto && (
                <Bloco label="Veredicto">
                  <p
                    className={`text-sm ${
                      a.eficacia_veredicto === "Eficaz" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {a.eficacia_veredicto}
                  </p>
                </Bloco>
              )}
            </div>
          </div>

          {podeAvaliarEficacia && (
            <div className="rounded-2xl bg-cream-50 gold-border gold-shadow p-6">
              <MarcarEficacia
                acaoId={a.id}
                veredictoActual={a.eficacia_veredicto}
                dataActual={a.eficacia_data}
              />
            </div>
          )}
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
