import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldAlert, Plus, ArrowRight } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getRiscosDaEmpresa } from "@/lib/data/modulos/riscos";
import { corPrioridade } from "@/lib/prioridade";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Riscos" };

export default async function RiscosPage() {
  if (!PLATAFORMA.modulos.riscos) notFound();
  const perfil = await requerCliente();
  const riscos = await getRiscosDaEmpresa(perfil.id);

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
                  {PLATAFORMA.labels.riscos}
                </p>
              </div>
              <h1 className="font-serif italic text-3xl sm:text-4xl gold-text-rich">
                Mapa vivo do que pode falhar.
              </h1>
            </div>
            <Link
              href="/riscos/novo"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-foil text-white text-sm gold-shadow hover:opacity-90 shrink-0"
            >
              <Plus className="w-4 h-4" /> Novo
            </Link>
          </div>

          {riscos.length === 0 ? (
            <div className="text-center py-16 text-ink-soft">
              <ShieldAlert className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <p className="mb-4">Sem riscos identificados.</p>
              <Link
                href="/riscos/novo"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gold-700 border border-gold-300 rounded-lg hover:bg-gold-50"
              >
                Identificar o primeiro →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {riscos.map((r) => (
                <Link
                  key={r.id}
                  href={`/riscos/${r.id}`}
                  className="group block rounded-2xl bg-cream-50 gold-border gold-shadow gold-glow-hover p-5 transition-all"
                >
                  <div className="flex items-start justify-between mb-2 gap-4">
                    <h3 className="font-serif italic text-xl text-ink">{r.titulo}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {r.nivel && (
                        <span className={`px-2 py-1 text-xs rounded border ${corPrioridade(r.nivel)}`}>
                          {r.nivel}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-ink-faint group-hover:text-gold-700" />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="text-gold-700 uppercase tracking-wider">{r.estado}</span>
                    {r.categoria && <span className="text-ink-soft">· {r.categoria}</span>}
                    {r.data_revisao && (
                      <span className="text-ink-faint">
                        · revisão {formatarData(r.data_revisao)}
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
