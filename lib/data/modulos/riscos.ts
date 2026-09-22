import { createClient } from "@/lib/supabase/server";

export interface Risco {
  id: string;
  empresa_id: string;
  titulo: string;
  descricao: string | null;
  categoria: string | null;
  probabilidade: string | null;
  impacto: string | null;
  nivel: string | null;
  colaborador_id: string | null;
  data_revisao: string | null;
  estado: string;
  criado_em: string;
  atualizado_em: string;
}

export async function getRiscosDaEmpresa(empresaId: string): Promise<Risco[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("riscos")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("atualizado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getRisco(id: string): Promise<Risco | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("riscos").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getTodosRiscos(): Promise<Risco[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("riscos")
    .select("*")
    .order("atualizado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}
