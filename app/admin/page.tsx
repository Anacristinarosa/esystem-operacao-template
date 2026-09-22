import Link from "next/link";
import { Users, AlertCircle, ShieldAlert, CheckSquare } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { AdicionarEmpresa } from "@/components/admin/adicionar-empresa";
import { requerFounder } from "@/lib/auth";
import { getEmpresas } from "@/lib/data/admin";
import { PLATAFORMA } from "@/lib/config";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Painel da founder" };

export default async function AdminPage() {
  await requerFounder();
  const empresas = await getEmpresas();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 gold-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                Painel da founder
              </p>
            </div>
            <h1 className="font-serif italic text-4xl sm:text-5xl gold-text-rich">
              {PLATAFORMA.nome}
            </h1>
            <p className="mt-3 text-sm text-ink-soft italic">
              Aqui vês todas as empresas que usam a tua app.
            </p>
          </div>

          <AdicionarEmpresa />

          <div className="rounded-2xl bg-cream-50 gold-border-rich gold-shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gold-200 flex items-center gap-3">
              <Users className="w-4 h-4 text-gold-600" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-700 font-medium">
                Empresas ({empresas.length})
              </p>
            </div>

            {empresas.length === 0 ? (
              <p className="text-center text-ink-soft py-10">
                Ainda não tens empresas registadas.
              </p>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gold-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">
                      Contacto
                    </th>
                    {PLATAFORMA.modulos.ocorrencias && (
                      <th className="px-4 py-3 text-center text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        Abertas
                      </th>
                    )}
                    {PLATAFORMA.modulos.riscos && (
                      <th className="px-4 py-3 text-center text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">
                        <ShieldAlert className="w-3 h-3 inline mr-1" />
                        Riscos
                      </th>
                    )}
                    {PLATAFORMA.modulos.acoes && (
                      <th className="px-4 py-3 text-center text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">
                        <CheckSquare className="w-3 h-3 inline mr-1" />
                        Ações
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">
                      Última entrada
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-gold-100 last:border-0 hover:bg-gold-50/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/empresas/${e.id}`}
                          className="font-serif italic text-lg text-ink hover:text-gold-700"
                        >
                          {e.empresa_nome ?? e.nome ?? "—"}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-soft">
                        <div>{e.nome ?? "—"}</div>
                        <div className="text-xs text-ink-faint">{e.email}</div>
                      </td>
                      {PLATAFORMA.modulos.ocorrencias && (
                        <td className="px-4 py-4 text-center text-sm text-ink-soft">
                          {e.ocorrencias_abertas}
                        </td>
                      )}
                      {PLATAFORMA.modulos.riscos && (
                        <td className="px-4 py-4 text-center text-sm text-ink-soft">
                          {e.riscos_activos}
                        </td>
                      )}
                      {PLATAFORMA.modulos.acoes && (
                        <td className="px-4 py-4 text-center text-sm text-ink-soft">
                          {e.acoes_pendentes}
                        </td>
                      )}
                      <td className="px-6 py-4 text-xs text-ink-faint">
                        {e.ultima_entrada ? formatarData(e.ultima_entrada) : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/empresas/${e.id}`}
                          className="text-xs text-gold-700 hover:text-gold-800"
                        >
                          Abrir →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
