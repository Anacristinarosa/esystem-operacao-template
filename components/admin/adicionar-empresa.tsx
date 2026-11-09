"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdicionarEmpresa() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [empresaNome, setEmpresaNome] = useState("");
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState<
    | { tipo: "idle" }
    | { tipo: "loading" }
    | { tipo: "ok"; msg: string }
    | { tipo: "erro"; msg: string }
  >({ tipo: "idle" });

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !nome.trim() || !empresaNome.trim()) return;

    setEstado({ tipo: "loading" });
    const res = await fetch("/api/admin/criar-empresa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        nome: nome.trim(),
        empresa_nome: empresaNome.trim(),
        password: password.trim() || undefined,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setEstado({ tipo: "erro", msg: data.erro ?? "Erro ao adicionar." });
      return;
    }

    setEstado({
      tipo: "ok",
      msg: `Empresa adicionada. Password: ${data.password}`,
    });
    setNome("");
    setEmail("");
    setEmpresaNome("");
    setPassword("");
    router.refresh();
  }

  return (
    <div className="rounded-2xl bg-cream-50 gold-border gold-shadow p-6 mb-10">
      <div className="mb-4">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">
          Adicionar empresa
        </p>
        <p className="text-sm text-ink-soft">
          Escreve o nome da empresa, o contacto e o email. A password inicial aparece no aviso depois de adicionares (guarda-a e envia-a
          por um canal privado). A empresa pode mudá-la depois de entrar.
        </p>
      </div>

      <form onSubmit={adicionar} className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          required
          placeholder="nome da empresa"
          value={empresaNome}
          onChange={(e) => setEmpresaNome(e.target.value)}
          className="rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-gold-400"
        />
        <input
          type="text"
          required
          placeholder="nome do contacto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-gold-400"
        />
        <input
          type="email"
          required
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-gold-400"
        />
        <input
          type="text"
          placeholder="password (opcional, mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-gold-400"
        />
        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" size="sm" disabled={estado.tipo === "loading"}>
            {estado.tipo === "loading" ? "A adicionar…" : "Adicionar empresa"}
          </Button>
        </div>
      </form>

      {estado.tipo === "ok" && (
        <p className="mt-3 text-sm text-success">{estado.msg}</p>
      )}
      {estado.tipo === "erro" && (
        <p className="mt-3 text-sm text-red-600">{estado.msg}</p>
      )}
    </div>
  );
}
