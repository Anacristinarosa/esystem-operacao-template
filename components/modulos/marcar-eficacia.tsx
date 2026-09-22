"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MarcarEficacia({
  acaoId,
  veredictoActual,
  dataActual,
}: {
  acaoId: string;
  veredictoActual: string | null;
  dataActual: string | null;
}) {
  const router = useRouter();
  const [veredicto, setVeredicto] = useState<string>(veredictoActual ?? "");
  const [data, setData] = useState<string>(
    dataActual ?? new Date().toISOString().slice(0, 10),
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!veredicto) return;
    setLoading(true);
    setMsg(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("acoes")
      .update({
        eficacia_veredicto: veredicto,
        eficacia_data: data,
        estado: "Verificada",
      })
      .eq("id", acaoId);
    if (error) {
      setMsg("Erro: " + error.message);
      setLoading(false);
      return;
    }
    setMsg("Guardado.");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={guardar} className="space-y-3">
      <p className="text-[10px] tracking-[0.2em] uppercase text-gold-600">Eficácia</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          value={veredicto}
          onChange={(e) => setVeredicto(e.target.value)}
          className="rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
          required
        >
          <option value="">— veredicto —</option>
          <option value="Eficaz">Eficaz</option>
          <option value="Não eficaz">Não eficaz</option>
        </select>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading || !veredicto}
        className="inline-flex items-center gap-2 rounded-md bg-gold-foil text-white gold-shadow hover:opacity-90 text-xs px-3 py-1.5 font-medium tracking-[0.05em] uppercase"
      >
        {loading ? "A guardar…" : "Marcar eficácia"}
      </button>
      {msg && <p className="text-xs text-ink-soft">{msg}</p>}
    </form>
  );
}
