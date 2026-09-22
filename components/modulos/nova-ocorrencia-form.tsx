"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  PLATAFORMA,
  ORIGENS_OCORRENCIA,
  SEVERIDADE,
  FREQUENCIA,
} from "@/lib/config";
import { calcularPrioridadeOcorrencia, corPrioridade } from "@/lib/prioridade";

interface ColabOption {
  id: string;
  nome: string;
}

export function NovaOcorrenciaForm() {
  const router = useRouter();
  const [colaboradores, setColaboradores] = useState<ColabOption[]>([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [origem, setOrigem] = useState<string>(ORIGENS_OCORRENCIA[0]);
  const [severidade, setSeveridade] = useState<string>("Média");
  const [frequencia, setFrequencia] = useState<string>("Isolada");
  const [colaboradorId, setColaboradorId] = useState<string>("");
  const [prazo, setPrazo] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const prioridade = calcularPrioridadeOcorrencia(severidade, frequencia);

  useEffect(() => {
    async function carregar() {
      const supabase = createClient();
      const { data } = await supabase
        .from("colaboradores")
        .select("id, nome")
        .order("nome");
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
    const { error } = await supabase.from("ocorrencias").insert({
      empresa_id: user.id,
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      origem,
      severidade,
      frequencia,
      prioridade,
      colaborador_id: colaboradorId || null,
      prazo: prazo || null,
      estado: PLATAFORMA.estados.ocorrencias[0],
    });
    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }
    router.push("/ocorrencias");
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
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-gold-400"
        />
      </Campo>

      <Campo label="Descrição">
        <textarea
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-gold-400"
        />
      </Campo>

      <Campo label="Origem">
        <select
          value={origem}
          onChange={(e) => setOrigem(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        >
          {ORIGENS_OCORRENCIA.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Severidade">
          <select
            value={severidade}
            onChange={(e) => setSeveridade(e.target.value)}
            className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
          >
            {SEVERIDADE.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Frequência">
          <select
            value={frequencia}
            onChange={(e) => setFrequencia(e.target.value)}
            className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
          >
            {FREQUENCIA.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </Campo>
      </div>

      {prioridade && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-soft">Prioridade calculada:</span>
          <span className={`px-2 py-1 text-xs rounded border ${corPrioridade(prioridade)}`}>
            {prioridade}
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
          {loading ? "A guardar…" : "Registar ocorrência"}
        </Button>
        <Link
          href="/ocorrencias"
          className="text-sm text-ink-faint hover:text-gold-700"
        >
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
