"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [aCarregar, setACarregar] = useState(false);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setACarregar(true);

    if (password.length < 8) {
      setErro("A password precisa de ter pelo menos 8 caracteres.");
      setACarregar(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    });

    if (error) {
      setErro(traduzirErro(error.message));
      setACarregar(false);
      return;
    }

    // Se o email precisa de confirmação, sessão fica null
    if (data.session) {
      router.push("/jornada");
      router.refresh();
    } else {
      setSucesso(true);
      setACarregar(false);
    }
  }

  if (sucesso) {
    return (
      <div className="text-center space-y-4">
        <p className="font-serif italic text-2xl gold-text-rich">Conta criada.</p>
        <p className="text-ink-soft">
          Confirma o teu email — enviámos-te um link para ativares a conta.
        </p>
        <Link href="/login" className="text-gold-700 hover:text-gold-600 font-medium">
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submeter} className="space-y-5">
      <Input
        id="nome"
        type="text"
        label="Nome"
        placeholder="Como te chamam"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        autoComplete="name"
      />
      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="tu@exemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
        minLength={8}
      />
      {erro && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {erro}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={aCarregar}>
        {aCarregar ? "A criar conta…" : "Criar conta"}
      </Button>
      <p className="text-center text-sm text-ink-soft">
        Já tens conta?{" "}
        <Link href="/login" className="text-gold-700 hover:text-gold-600 font-medium">
          Entrar
        </Link>
      </p>
    </form>
  );
}

function traduzirErro(msg: string): string {
  if (msg.toLowerCase().includes("already registered"))
    return "Este email já está registado. Vai a entrar.";
  if (msg.toLowerCase().includes("password"))
    return "A password precisa de ter pelo menos 8 caracteres.";
  return msg;
}
