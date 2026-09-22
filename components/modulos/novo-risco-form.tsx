"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  PLATAFORMA,
  CATEGORIAS_RISCO,
  PROBABILIDADE,
  IMPACTO,
} from "@/lib/config";
import { calcularNivelRisco, corPrioridade } from "@/lib/prioridade";

interface ColabOption {
  id: string;
  nome: string;
}

export function NovoRiscoForm() {
  const router = useRouter();
  const [colaboradores, setColaboradores] = useState<ColabOption[]>([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<string>(CATEGORIAS_RISCO[0]);
  const [probabilidade, setProbabilidade] = useState<string>("Possível");
  const [impacto, setImpacto] = useState<string>("Moderado");
  const [colaboradorId, setColaboradorId] = useState<string>("");
  const [dataRevisao, setDataRevisao] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nivel = calcularNivelRisco(probabilidade, impacto);

  useEffect(() => {
    async function carregar() {
      const supabase = createClient();
      const { data } = await supabase.from("colaboradores").select("id, nome").order("nome");
      setColaboradores(data ?? []);
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
    const { error } = await supabase.from("riscos").insert({
      empresa_id: user.id,
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      categoria,
      probabilidade,
      impacto,
      nivel,
      colaborador_id: colaboradorId || null,
      data_revisao: dataRevisao || null,
      estado: PLATAFORMA.estados.riscos[0],
    });
    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }
    router.push("/riscos");
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

      <Campo label="Categoria">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        >
          {CATEGORIAS_RISCO.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Probabilidade">
          <select
            value={probabilidade}
            onChange={(e) => setProbabilidade(e.target.value)}
            className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
          >
            {PROBABILIDADE.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Impacto">
          <select
            value={impacto}
            onChange={(e) => setImpacto(e.target.value)}
            className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
          >
            {IMPACTO.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </Campo>
      </div>

      {nivel && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-soft">Nível calculado:</span>
          <span className={`px-2 py-1 text-xs rounded border ${corPrioridade(nivel)}`}>
            {nivel}
          </span>
        </div>
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

      <Campo label="Data de revisão (opcional)">
        <input
          type="date"
          value={dataRevisao}
          onChange={(e) => setDataRevisao(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        />
      </Campo>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" size="md" disabled={loading}>
          {loading ? "A guardar…" : "Registar risco"}
        </Button>
        <Link href="/riscos" className="text-sm text-ink-faint hover:text-gold-700">
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
