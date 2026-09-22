import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckSquare, Plus, ArrowRight } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getAcoesDaEmpresa } from "@/lib/data/modulos/acoes";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Ações" };

export default async function AcoesPage() {
  if (!PLATAFORMA.modulos.acoes) notFound();
  const perfil = await requerCliente();
  const acoes = await getAcoesDaEmpresa(perfil.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-10 flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 gold-divider" />
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                  {PLATAFORMA.labels.acoes}
                </p>
              </div>
              <h1 className="font-serif italic text-3xl sm:text-4xl gold-text-rich">
                Correctivas, preventivas, de melhoria.
              </h1>
            </div>
            <Link
              href="/acoes/nova"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-foil text-white text-sm gold-shadow hover:opacity-90 shrink-0"
            >
              <Plus className="w-4 h-4" /> Nova
            </Link>
          </div>

          {acoes.length === 0 ? (
            <div className="text-center py-16 text-ink-soft">
              <CheckSquare className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <p className="mb-4">Sem ações definidas.</p>
              <Link
                href="/acoes/nova"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gold-700 border border-gold-300 rounded-lg hover:bg-gold-50"
              >
                Definir a primeira →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {acoes.map((a) => (
                <Link
                  key={a.id}
                  href={`/acoes/${a.id}`}
                  className="group block rounded-2xl bg-cream-50 gold-border gold-shadow gold-glow-hover p-5 transition-all"
                >
                  <div className="flex items-start justify-between mb-2 gap-4">
                    <h3 className="font-serif italic text-xl text-ink">{a.titulo}</h3>
                    <ArrowRight className="w-4 h-4 text-ink-faint group-hover:text-gold-700 shrink-0 mt-1" />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="text-gold-700 uppercase tracking-wider">{a.estado}</span>
                    {a.tipo && <span className="text-ink-soft">· {a.tipo}</span>}
                    {a.prazo && (
                      <span className="text-ink-faint">· prazo {formatarData(a.prazo)}</span>
                    )}
                    {a.eficacia_veredicto && (
                      <span
                        className={
                          a.eficacia_veredicto === "Eficaz"
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        · {a.eficacia_veredicto}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
