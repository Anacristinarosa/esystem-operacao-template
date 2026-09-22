"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aCarregar, setACarregar] = useState(false);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setACarregar(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErro(traduzirErro(error.message));
      setACarregar(false);
      return;
    }

    router.push("/jornada");
    router.refresh();
  }

  return (
    <form onSubmit={submeter} className="space-y-5">
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
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      {erro && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {erro}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={aCarregar}>
        {aCarregar ? "A entrar…" : "Entrar"}
      </Button>
    </form>
  );
}

function traduzirErro(msg: string): string {
  if (msg.toLowerCase().includes("invalid login")) return "Email ou password errados.";
  if (msg.toLowerCase().includes("email not confirmed"))
    return "Confirma o teu email antes de entrar.";
  return msg;
}
