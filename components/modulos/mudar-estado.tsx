"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  tabela: "ocorrencias" | "riscos" | "acoes" | "fornecedores";
  id: string;
  estadoActual: string;
  estados: readonly string[];
}

export function MudarEstado({ tabela, id, estadoActual, estados }: Props) {
  const router = useRouter();
  const [valor, setValor] = useState(estadoActual);
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "erro">("idle");

  async function guardar(novo: string) {
    if (novo === estadoActual) return;
    setValor(novo);
    setEstado("loading");
    const supabase = createClient();
    const updates: Record<string, string> = { estado: novo };
    if (tabela === "acoes" && novo === "Concluída") {
      updates.data_conclusao = new Date().toISOString().slice(0, 10);
    }
    const { error } = await supabase.from(tabela).update(updates).eq("id", id);
    if (error) {
      setEstado("erro");
      return;
    }
    setEstado("ok");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-[10px] tracking-[0.2em] uppercase text-gold-600">
        Estado
      </label>
      <select
        value={valor}
        onChange={(e) => guardar(e.target.value)}
        className="rounded-lg border border-gold-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-gold-400"
      >
        {estados.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      {estado === "loading" && <span className="text-xs text-ink-faint">A guardar…</span>}
      {estado === "erro" && <span className="text-xs text-red-600">Erro</span>}
      {estado === "ok" && <span className="text-xs text-success">Guardado</span>}
    </div>
  );
}
