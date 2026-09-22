"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { PLATAFORMA, TIPOS_ACAO } from "@/lib/config";

interface OptionRow {
  id: string;
  titulo?: string;
  nome?: string;
}

export function NovaAcaoForm() {
  const router = useRouter();
  const [colaboradores, setColaboradores] = useState<OptionRow[]>([]);
  const [ocorrencias, setOcorrencias] = useState<OptionRow[]>([]);
  const [riscos, setRiscos] = useState<OptionRow[]>([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<string>(TIPOS_ACAO[0]);
  const [origemOcorrencia, setOrigemOcorrencia] = useState<string>("");
  const [origemRisco, setOrigemRisco] = useState<string>("");
  const [colaboradorId, setColaboradorId] = useState<string>("");
  const [prazo, setPrazo] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregar() {
      const supabase = createClient();
      const [colabs, ocs, rcs] = await Promise.all([
        supabase.from("colaboradores").select("id, nome").order("nome"),
        supabase.from("ocorrencias").select("id, titulo").order("atualizado_em", { ascending: false }),
        supabase.from("riscos").select("id, titulo").order("atualizado_em", { ascending: false }),
      ]);
      setColaboradores(colabs.data ?? []);
      setOcorrencias(ocs.data ?? []);
      setRiscos(rcs.data ?? []);
    }
    carregar();
  }, []);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setErro("Sessão expirada.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("acoes").insert({
      empresa_id: user.id,
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      tipo,
      origem_ocorrencia_id: origemOcorrencia || null,
      origem_risco_id: origemRisco || null,
      colaborador_id: colaboradorId || null,
      prazo: prazo || null,
      estado: PLATAFORMA.estados.acoes[0],
    });
    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }
    router.push("/acoes");
    router.refresh();
  }

  return (
    <form onSubmit={submeter} className="space-y-5">
      <Campo label="Título">
        <input
          type="text"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        />
      </Campo>

      <Campo label="Descrição">
        <textarea
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        />
      </Campo>

      <Campo label="Tipo">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        >
          {TIPOS_ACAO.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Campo>

      {PLATAFORMA.modulos.ocorrencias && (
        <Campo label="Origem: ocorrência (opcional)">
          <select
            value={origemOcorrencia}
            onChange={(e) => setOrigemOcorrencia(e.target.value)}
            className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
          >
            <option value="">— nenhuma —</option>
            {ocorrencias.map((o) => (
              <option key={o.id} value={o.id}>
                {o.titulo}
              </option>
            ))}
          </select>
        </Campo>
      )}

      {PLATAFORMA.modulos.riscos && (
        <Campo label="Origem: risco (opcional)">
          <select
            value={origemRisco}
            onChange={(e) => setOrigemRisco(e.target.value)}
            className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
          >
            <option value="">— nenhum —</option>
            {riscos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.titulo}
              </option>
            ))}
          </select>
        </Campo>
      )}

      <Campo label="Responsável (opcional)">
        <select
          value={colaboradorId}
          onChange={(e) => setColaboradorId(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        >
          <option value="">— sem responsável —</option>
          {colaboradores.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </Campo>

      <Campo label="Prazo (opcional)">
        <input
          type="date"
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        />
      </Campo>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" size="md" disabled={loading}>
          {loading ? "A guardar…" : "Registar ação"}
        </Button>
        <Link href="/acoes" className="text-sm text-ink-faint hover:text-gold-700">
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.2em] uppercase text-gold-600 mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}
