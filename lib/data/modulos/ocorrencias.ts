import { createClient } from "@/lib/supabase/server";

export interface Ocorrencia {
  id: string;
  empresa_id: string;
  titulo: string;
  descricao: string | null;
  origem: string | null;
  severidade: string | null;
  frequencia: string | null;
  prioridade: string | null;
  colaborador_id: string | null;
  fornecedor_id: string | null;
  data_abertura: string;
  prazo: string | null;
  estado: string;
  data_reavaliacao: string | null;
  criado_em: string;
  atualizado_em: string;
}

export async function getOcorrenciasDaEmpresa(empresaId: string): Promise<Ocorrencia[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ocorrencias")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("atualizado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getOcorrencia(id: string): Promise<Ocorrencia | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ocorrencias")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getTodasOcorrencias(): Promise<Ocorrencia[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ocorrencias")
    .select("*")
    .order("atualizado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}
