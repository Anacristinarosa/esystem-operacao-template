import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { MudarEstado } from "@/components/modulos/mudar-estado";
import { NovaAvaliacao } from "@/components/modulos/nova-avaliacao";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getFornecedor, getAvaliacoesFornecedor } from "@/lib/data/modulos/fornecedores";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Fornecedor" };

export default async function FornecedorDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const perfil = await requerCliente();
  const { id } = await params;
  const f = await getFornecedor(id);
  if (!f) notFound();
  if (perfil.role !== "founder" && f.empresa_id !== perfil.id) notFound();

  const avaliacoes = await getAvaliacoesFornecedor(f.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/fornecedores"
            className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> {PLATAFORMA.labels.fornecedores}
          </Link>

          <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">
              Fornecedor
            </p>
            <h1 className="font-serif italic text-3xl gold-text-rich">{f.nome}</h1>
          </div>

          <div className="rounded-2xl bg-cream-50 gold-border gold-shadow p-6 mb-6">
            <MudarEstado
              tabela="fornecedores"
              id={f.id}
              estadoActual={f.estado}
              estados={PLATAFORMA.estados.fornecedores}
            />
          </div>

          <div className="rounded-2xl bg-white gold-border p-6 space-y-4 mb-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {f.categoria && <Bloco label="Categoria"><p className="text-sm text-ink">{f.categoria}</p></Bloco>}
              {f.email && <Bloco label="Email"><p className="text-sm text-ink">{f.email}</p></Bloco>}
              {f.telefone && <Bloco label="Telefone"><p className="text-sm text-ink">{f.telefone}</p></Bloco>}
              {f.data_qualificacao && (
                <Bloco label="Qualificado em"><p className="text-sm text-ink">{formatarData(f.data_qualificacao)}</p></Bloco>
              )}
              {f.proxima_avaliacao && (
                <Bloco label="Próxima avaliação"><p className="text-sm text-ink">{formatarData(f.proxima_avaliacao)}</p></Bloco>
              )}
            </div>
            {f.observacoes && (
              <Bloco label="Observações">
                <p className="text-sm text-ink whitespace-pre-wrap">{f.observacoes}</p>
              </Bloco>
            )}
          </div>

          <div className="rounded-2xl bg-cream-50 gold-border gold-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                Avaliações ({avaliacoes.length})
              </p>
              <NovaAvaliacao fornecedorId={f.id} />
            </div>

            {avaliacoes.length === 0 ? (
              <p className="text-sm text-ink-soft italic">Sem avaliações registadas.</p>
            ) : (
              <div className="space-y-3">
                {avaliacoes.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl bg-white gold-border p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-serif italic text-lg text-ink">
                        {formatarData(a.data)}
                      </p>
                      <div className="flex items-center gap-3">
                        {a.nota_geral !== null && (
                          <span className="text-sm text-gold-700 font-medium">
                            Nota {a.nota_geral}
                          </span>
                        )}
                        {a.decisao && (
                          <span className="text-xs uppercase tracking-wider text-ink-soft">
                            {a.decisao}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
                      {a.nota_qualidade !== null && <span>Qualidade {a.nota_qualidade}</span>}
                      {a.nota_prazo !== null && <span>Prazo {a.nota_prazo}</span>}
                      {a.nota_preco !== null && <span>Preço {a.nota_preco}</span>}
                      {a.nota_comunicacao !== null && <span>Comunicação {a.nota_comunicacao}</span>}
                    </div>
                    {a.observacoes && (
                      <p className="text-xs text-ink-soft mt-2 whitespace-pre-wrap">
                        {a.observacoes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
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
