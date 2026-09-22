import { createClient } from "@/lib/supabase/server";

export interface Fornecedor {
  id: string;
  empresa_id: string;
  nome: string;
  categoria: string | null;
  email: string | null;
  telefone: string | null;
  data_qualificacao: string | null;
  estado: string;
  proxima_avaliacao: string | null;
  observacoes: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface AvaliacaoFornecedor {
  id: string;
  empresa_id: string;
  fornecedor_id: string;
  data: string;
  nota_qualidade: number | null;
  nota_prazo: number | null;
  nota_preco: number | null;
  nota_comunicacao: number | null;
  nota_geral: number | null;
  observacoes: string | null;
  decisao: string | null;
  criado_em: string;
}

export async function getFornecedoresDaEmpresa(empresaId: string): Promise<Fornecedor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fornecedores")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("atualizado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getFornecedor(id: string): Promise<Fornecedor | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("fornecedores").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getAvaliacoesFornecedor(fornecedorId: string): Promise<AvaliacaoFornecedor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("avaliacoes_fornecedor")
    .select("*")
    .eq("fornecedor_id", fornecedorId)
    .order("data", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getTodosFornecedores(): Promise<Fornecedor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fornecedores")
    .select("*")
    .order("atualizado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}
