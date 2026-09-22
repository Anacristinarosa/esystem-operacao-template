"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function NovaAvaliacao({ fornecedorId }: { fornecedorId: string }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [q, setQ] = useState(4);
  const [pr, setPr] = useState(4);
  const [pc, setPc] = useState(4);
  const [c, setC] = useState(4);
  const [decisao, setDecisao] = useState("Manter qualificado");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const notaGeral = ((q + pr + pc + c) / 4).toFixed(2);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setErro("Sessão expirada.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("avaliacoes_fornecedor").insert({
      empresa_id: user.id,
      fornecedor_id: fornecedorId,
      data,
      nota_qualidade: q,
      nota_prazo: pr,
      nota_preco: pc,
      nota_comunicacao: c,
      nota_geral: parseFloat(notaGeral),
      observacoes: observacoes.trim() || null,
      decisao,
    });
    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }
    setAberto(false);
    setLoading(false);
    router.refresh();
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="inline-flex items-center gap-2 rounded-md bg-gold-foil text-white gold-shadow hover:opacity-90 text-xs px-3 py-1.5 font-medium tracking-[0.05em] uppercase"
      >
        Nova avaliação
      </button>
    );
  }

  return (
    <form onSubmit={guardar} className="space-y-4 mt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo label="Data">
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full rounded-lg border border-gold-200 bg-white px-3 py-1.5 text-sm"
            required
          />
        </Campo>
        <Campo label={`Nota geral (${notaGeral})`}>
          <p className="text-sm text-ink-soft py-1.5">média das 4 notas</p>
        </Campo>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <NotaCampo label="Qualidade" valor={q} setValor={setQ} />
        <NotaCampo label="Prazo" valor={pr} setValor={setPr} />
        <NotaCampo label="Preço" valor={pc} setValor={setPc} />
        <NotaCampo label="Comunicação" valor={c} setValor={setC} />
      </div>

      <Campo label="Decisão">
        <select
          value={decisao}
          onChange={(e) => setDecisao(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-3 py-1.5 text-sm"
        >
          <option>Manter qualificado</option>
          <option>Sob observação</option>
          <option>Desqualificar</option>
        </select>
      </Campo>

      <Campo label="Observações">
        <textarea
          rows={3}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-3 py-1.5 text-sm"
        />
      </Campo>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-gold-foil text-white gold-shadow hover:opacity-90 text-xs px-3 py-1.5 font-medium tracking-[0.05em] uppercase"
        >
          {loading ? "A guardar…" : "Guardar avaliação"}
        </button>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="text-sm text-ink-faint hover:text-gold-700"
        >
          Cancelar
        </button>
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

function NotaCampo({
  label,
  valor,
  setValor,
}: {
  label: string;
  valor: number;
  setValor: (n: number) => void;
}) {
  return (
    <Campo label={label}>
      <select
        value={valor}
        onChange={(e) => setValor(parseInt(e.target.value))}
        className="w-full rounded-lg border border-gold-200 bg-white px-3 py-1.5 text-sm"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </Campo>
  );
}
