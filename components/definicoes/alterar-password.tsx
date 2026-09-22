"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AlterarPassword() {
  const [nova, setNova] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [pendente, setPendente] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setOk(false);

    if (nova.length < 8) {
      setErro("A password nova tem de ter pelo menos 8 caracteres.");
      return;
    }
    if (nova !== confirmar) {
      setErro("As duas passwords não coincidem.");
      return;
    }

    setPendente(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: nova });
    setPendente(false);

    if (error) {
      setErro(error.message);
      return;
    }
    setOk(true);
    setNova("");
    setConfirmar("");
  }

  return (
    <form onSubmit={submeter} className="space-y-5">
      <Input
        id="nova"
        type="password"
        label="Nova password"
        placeholder="••••••••"
        value={nova}
        onChange={(e) => setNova(e.target.value)}
        required
        autoComplete="new-password"
      />
      <Input
        id="confirmar"
        type="password"
        label="Confirmar nova password"
        placeholder="••••••••"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        required
        autoComplete="new-password"
      />

      {erro && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {erro}
        </p>
      )}
      {ok && (
        <p className="text-sm text-success bg-success/10 border border-success/30 rounded-md px-3 py-2">
          Password alterada. A próxima vez que entrares, usa a nova.
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pendente}>
        {pendente ? "A guardar…" : "Alterar password"}
      </Button>
    </form>
  );
}
