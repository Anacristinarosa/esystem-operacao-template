"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { PLATAFORMA } from "@/lib/config";

export function NovoFornecedorForm() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataQualificacao, setDataQualificacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    const { error } = await supabase.from("fornecedores").insert({
      empresa_id: user.id,
      nome: nome.trim(),
      categoria: categoria.trim() || null,
      email: email.trim() || null,
      telefone: telefone.trim() || null,
      data_qualificacao: dataQualificacao || null,
      estado: PLATAFORMA.estados.fornecedores[0],
    });
    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }
    router.push("/fornecedores");
    router.refresh();
  }

  return (
    <form onSubmit={submeter} className="space-y-5">
      <Campo label="Nome">
        <input
          type="text"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        />
      </Campo>

      <Campo label="Categoria (opcional)">
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Email (opcional)">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
          />
        </Campo>

        <Campo label="Telefone (opcional)">
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
          />
        </Campo>
      </div>

      <Campo label="Data de qualificação (opcional)">
        <input
          type="date"
          value={dataQualificacao}
          onChange={(e) => setDataQualificacao(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm"
        />
      </Campo>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" size="md" disabled={loading}>
          {loading ? "A guardar…" : "Registar fornecedor"}
        </Button>
        <Link href="/fornecedores" className="text-sm text-ink-faint hover:text-gold-700">
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
