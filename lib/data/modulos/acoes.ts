import { createClient } from "@/lib/supabase/server";

export interface Acao {
  id: string;
  empresa_id: string;
  titulo: string;
  descricao: string | null;
  tipo: string | null;
  origem_ocorrencia_id: string | null;
  origem_risco_id: string | null;
  colaborador_id: string | null;
  prazo: string | null;
  data_conclusao: string | null;
  eficacia_data: string | null;
  eficacia_veredicto: string | null;
  estado: string;
  criado_em: string;
  atualizado_em: string;
}

export async function getAcoesDaEmpresa(empresaId: string): Promise<Acao[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("acoes")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("atualizado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getAcao(id: string): Promise<Acao | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("acoes").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getTodasAcoes(): Promise<Acao[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("acoes")
    .select("*")
    .order("atualizado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}
